import { SubstrateBatchProcessor } from '@subsquid/substrate-processor'
import { TypeormDatabase } from '@subsquid/typeorm-store'
import * as fs from 'fs'
import { TransactionType } from '@subsquid/substrate-frontier-evm/lib/transaction'
import * as erc20 from './erc20'
import { Transaction } from './model'
import { lookupArchive } from '@subsquid/archive-registry'
import { getTransaction } from '@subsquid/substrate-frontier-evm'
import * as aws from 'aws-sdk'
const Web3 = require('web3');
const APPROVE_MAX_VALUE = 115792089237316195423570985008687907853269984665640564039457584007913129639935n

const TransactionGetSkimFilterThreshold = 10
const SymbolAccumulateAndStartSkimLimit = 15
var SkimIndex = 0

const InputDataDecoder = require('ethereum-input-data-decoder');
let eth20_abi = JSON.parse(fs.readFileSync(`${__dirname}/../src/abi/erc20.json`, 'utf8'));

const decoder = new InputDataDecoder(eth20_abi)// (`${__dirname}/../src/abi/erc20.json`);
// append on restarts
// const csvWriter = fs.createWriteStream(`${__dirname}/../assets/astar-transactions.csv`, { flags: 'w', encoding: "utf-8" })
// csvWriter.write(`id,block,timestamp,txHash,input,from,to,type,sighash,amount,symbol\n`)

const networkName = 'astar';
const OnchainScoringStreamArn = process.env.DELIVERY_STREAM_ARN || '';
const OnchainScoringStreamName = OnchainScoringStreamArn.split('/').slice(-1)[0];
// const OnchainScoringStreamName = 'OnchainScoringSystemStack-AsterPipelineasterfirehos-FCiOKzTYiGUw';

var addressSymbolMap = new Map()

// const networkName = 'shibuya';
// const OnchainScoringStreamName = 'OnchainScoringSystemStack-ShibuyaPipelineshibuyafir-tir1A2yyQg97';

aws.config.update({ region: process.env.REGION });
// aws.config.update({ region: 'us-east-1' });
const firehoseClient = new aws.Firehose()
let web3 = new Web3('wss://astar.api.onfinality.io/public-ws');//Web3.givenProvider ||
const evmSymbolFunctionSelector = Web3.utils.keccak256("symbol()").slice(2, 10);
var tokenContractTo = new web3.eth.Contract(eth20_abi);

class Erc20Data {
  method: string;
  value: bigint;
  constructor(method: string, value: bigint) {
    this.method = method;
    this.value = value;
  }
}

// let putCount = 0;

const asyncStreamPutItem = async (timestamp: number, tx: Transaction, data: Erc20Data) => {
  if (data.value == 0n) return;
  // putCount++;
  if (data.method == 'approve') data.value = 0n;

  const params: any = {
    DeliveryStreamName: OnchainScoringStreamName,
    Record: {
      Data: JSON.stringify({
        'id': tx.id,
        'block': tx.block,
        'timestamp': new Date(timestamp).toISOString().substring(0,19), //to match with opensearch default date format, ex: timestamp
        'txHash': tx.txHash,
        'input': tx.input,
        'from': tx.from,
        'to': tx.to,
        'type': tx.type, //    Legacy, EIP2930, EIP1559,
        'sighash': tx.sighash,
        'method': data.method,
        'amount': Number(data.value / 1000000000000n),  // div by 10^12 then converto number ex: div by 10^9 and convert to string
        'symbol': tx.symbol
      })
    }
  }
  firehoseClient.putRecord(params, (err, data) => {
    if (err) console.log(err);
  })
}

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive(networkName, { release: 'FireSquid' }),
  })
  .setBatchSize(100)
  .addEthereumTransaction('*', {
    data: {
      call: true,
    }
  })

async function getSymbolSample(txData: any): Promise<string> {
  //check transaction symbol
  if (addressSymbolMap.has(txData.to)) {
    return addressSymbolMap.get(txData.to)
  }

  SkimIndex++
  if (addressSymbolMap.size >= SymbolAccumulateAndStartSkimLimit && SkimIndex % TransactionGetSkimFilterThreshold !== 0) {
    return ''
  }
  SkimIndex = 0
  var res = await web3.eth.getCode(txData.to)
  if (res == '0x') {
    return '';
  }

  tokenContractTo.options.address = txData.to
  if (res.includes(evmSymbolFunctionSelector)) {
    var symbolTo = 'UNKNOWN'
    try {
      symbolTo = await tokenContractTo.methods.symbol().call();
      console.log(symbolTo)
    } catch (err) {
      console.log(symbolTo)
    }
    addressSymbolMap.set(txData.to, symbolTo)
    return symbolTo;
  }
  return '';
}

processor.run(new TypeormDatabase(), async ctx => {
  const txs: Transaction[] = []

  for (let block of ctx.blocks) {
    for (let item of block.items) {

      if (item.kind === 'call' && item.name === 'Ethereum.transact') {

        let txData = getTransaction(ctx, item.call)
        const erc20Data = maybeErc20Data(txData.input)
        if (txData.to == undefined || txData.from == undefined) {
          ctx.log.debug(`Skipping tx ${txData.hash}`)
          continue;
        }

        var txSymbol = await getSymbolSample(txData);

        const tx = new Transaction({
          id: item.call.id,
          block: block.header.height,
          timestamp: new Date(block.header.timestamp),
          txHash: txData.hash,
          input: txData.input,
          from: txData.from,
          to: txData.to,
          type: txData.type || 0,
          sighash: txData.input.slice(0, 10),
          amount: erc20Data.value,
          symbol: txSymbol
        })
        asyncStreamPutItem(block.header.timestamp, tx, erc20Data);
        ctx.log.debug(`Tx: ${tx.txHash}, From: ${tx.from} To: ${tx.to} sighash: ${tx.sighash}`)
        txs.push(tx);

      }
    }
  }
  // for (const tx of txs) {
  //   csvWriter.write(`${tx.id},${tx.block},${tx.timestamp.getTime()},${tx.input},${tx.txHash},${tx.from},${tx.to},${TransactionType[tx.type]},${tx.sighash},${tx.amount}, ${tx.symbol}\n`)
  //   // console.log(putCount);
  // }
})


function maybeErc20Data(input: string): Erc20Data {
  let sighash = input.slice(0, 10)

  switch (sighash) {
    case erc20.functions['approve(address,uint256)'].sighash: {
      const decoded = erc20.functions['approve(address,uint256)'].decode(input)
      let v = decoded[1].toBigInt()
      return new Erc20Data(
        'approve',
        // -1 means approve MAX
        v == APPROVE_MAX_VALUE ? -1n : v
      )
    }
    case erc20.functions['transfer(address,uint256)'].sighash: {
      const decoded = erc20.functions['transfer(address,uint256)'].decode(input)
      return new Erc20Data(
        'transfer',
        decoded[1].toBigInt()
      )
    }
    case erc20.functions['transferFrom(address,address,uint256)'].sighash: {
      const decoded = erc20.functions['transferFrom(address,address,uint256)'].decode(input)
      return new Erc20Data(
        'transferFrom',
        decoded[2].toBigInt()
      )
    }
    default:
      return new Erc20Data('unknown', 0n)
  }
}

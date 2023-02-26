import { ethers } from "ethers";

const connectWallet = async (_setAddress: any) => {
  if (!(window as any).ethereum) {
    console.error("!window.ethereum");
    return;
  }

  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  console.log("provider:", provider);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();
  console.log("signer:", signer);

  const address = await signer.getAddress();
  console.log(`address: ${address}`);
  _setAddress(address);
};

export default connectWallet;

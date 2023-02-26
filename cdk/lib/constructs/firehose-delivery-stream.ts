// See also https://docs.aws.amazon.com/cdk/api/v2/docs/@aws-cdk_aws-kinesisfirehose-alpha.DeliveryStream.html
import { Construct } from 'constructs';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';import * as iam from 'aws-cdk-lib/aws-iam';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';

export interface FirehoseDeliveryStreamProps {
  readonly domain: opensearch.IDomain,
  readonly opensearchIndexName: string,
  readonly logBucket: s3.IBucket,
  readonly role: iam.IRole,
}

export class FirehoseDeliveryStream extends Construct {
  public readonly deliveryStream: firehose.CfnDeliveryStream;

  constructor(scope: Construct, id: string, props: FirehoseDeliveryStreamProps) {
    super(scope, id);

    const { domain, opensearchIndexName, logBucket, role } = props;

    const deliveryBucket = new s3.Bucket(this, 'DeliveryBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      serverAccessLogsBucket: logBucket,
      serverAccessLogsPrefix: `${opensearchIndexName}-stream-access-logs`,
    });

    const deliveryStream = new firehose.CfnDeliveryStream(this, 'DeliveryStream', {
      amazonopensearchserviceDestinationConfiguration: {
        indexName: opensearchIndexName,
        domainArn: domain.domainArn,
        roleArn: role.roleArn,
        cloudWatchLoggingOptions:{
          enabled: true,
          logGroupName: 'astar-delivery-stream-log-group',
          logStreamName: 'astar-delivery-stream-log-stream',
        },
        s3BackupMode: 'FailedDocumentsOnly',
        s3Configuration: {
          bucketArn: deliveryBucket.bucketArn,
          roleArn: role.roleArn,
          prefix: 'fail',
        },
        indexRotationPeriod: 'NoRotation',
      }
    });

    this.deliveryStream = deliveryStream;

    new CfnOutput(this, `${opensearchIndexName} DeliveryStreamArn`, {
      value: deliveryStream.attrArn,
    });
  }
}

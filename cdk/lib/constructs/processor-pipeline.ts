import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Domain } from 'aws-cdk-lib/aws-opensearchservice';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BucketDeployment } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { FirehoseDeliveryStream } from './firehose-delivery-stream';
import { ProcessorInstance } from './processor-instance';

export interface ProcessorPipelineProps {
    readonly vpc: ec2.IVpc,
    readonly deploymentBucket: s3.IBucket,
    readonly deployment: BucketDeployment,
    readonly domain: Domain,
    readonly logBucket: s3.IBucket,
    readonly opensearchIndexName: string,
    readonly domainAccessRole: iam.IRole,
}

export class ProcessorPipeline extends Construct {
  constructor(scope: Construct, id: string, props: ProcessorPipelineProps) {
    super(scope, id);

    const {vpc, deploymentBucket, deployment, domain, logBucket, opensearchIndexName, domainAccessRole} = props;

    const firehose = new FirehoseDeliveryStream(this, `${opensearchIndexName}-firehose`, {
        domain,
        opensearchIndexName,
        logBucket,
        role: domainAccessRole,
    });

    new ProcessorInstance(this, `${opensearchIndexName}-processor`, {
        vpc,
        deliveryStream: firehose.deliveryStream,
        deploymentBucket,
        deployment,
        opensearchIndexName,
    });
  }
}

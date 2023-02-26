import * as cdk from "aws-cdk-lib";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Web2FargateCluster } from "./constructs/web2-fargate-cluster";
import { ProcessorPipeline } from "./constructs/processor-pipeline";
import { Domain } from "aws-cdk-lib/aws-opensearchservice";
import * as ecs from "aws-cdk-lib/aws-ecs";

export interface OnchainScoringSystemStackProps extends cdk.StackProps {
  readonly domain: Domain;
  readonly domainAccessRole: iam.IRole;
  readonly grafanaPort: number;
  readonly grafanaRepositoryName: string;
  readonly grafanaApiKey: string;
  readonly nextjsPort: number;
}

export class OnchainScoringSystemStack extends cdk.Stack {
  public readonly cluster: ecs.ICluster;

  constructor(scope: Construct, id: string, props: OnchainScoringSystemStackProps) {
    super(scope, id, props);

    const { domain, domainAccessRole, grafanaPort, grafanaRepositoryName, grafanaApiKey, nextjsPort } = props;

    const logBucket = new s3.Bucket(this, "LogBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const deploymentBucket = new s3.Bucket(this, "DeploymentBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      serverAccessLogsBucket: logBucket,
      serverAccessLogsPrefix: "deployment-bucket-access-logs",
    });

    const deployment = new BucketDeployment(this, "Deployment", {
      sources: [Source.asset("../squid-processor", {
      })],
      exclude: ["node_modules/*"],
      destinationBucket: deploymentBucket,
      destinationKeyPrefix: "squid-processor/",
      memoryLimit: 2048,
    });

    const vpc = new ec2.Vpc(this, "Vpc", {
      natGateways: 1,
    });
    vpc.addFlowLog("FlowLogs", {
      destination: ec2.FlowLogDestination.toS3(logBucket, "vpc-flow-logs"),
    });
    // https://github.com/aws/aws-cdk/issues/18985
    vpc.node
      .findChild("FlowLogs")
      .node.findChild("FlowLog")
      .node.addDependency(logBucket);

    const fargateCluster = new Web2FargateCluster(this, "Web2Cluster", {
      vpc,
      domain,
      logBucket,
      grafanaPort,
      grafanaRepositoryName,
      nextjsPort,
      grafanaApiKey,
    });
    this.cluster = fargateCluster.cluster;

    new ProcessorPipeline(this, "AstarPipeline", {
      vpc,
      deploymentBucket,
      deployment,
      domain,
      logBucket,
      opensearchIndexName: "astar",
      domainAccessRole,
    });

    new CfnOutput(this, 'Deployment Bucket Url', {
      value: deploymentBucket.s3UrlForObject(),
    });
  }
}

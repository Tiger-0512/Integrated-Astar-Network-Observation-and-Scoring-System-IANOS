import { Stack, CfnOutput, RemovalPolicy, SecretValue } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { Construct } from 'constructs';

export interface OpenSearchClusterProps {
  readonly domainName: string,
  readonly isFineGrained: boolean,
  readonly domainMasterUserName?: string,
  readonly domainMasterUserPassword?: string,
}

export class OpenSearchCluster extends Construct {
  public readonly domain: opensearch.Domain;

  constructor(scope: Construct, id: string, props: OpenSearchClusterProps) {
    super(scope, id);

    const { domainName, isFineGrained } = props;

    // You can also create Service-Linked Role using the CDK, 
    // but note that only the first application deploying this will succeed:
    // See also: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_opensearchservice-readme.html
    new iam.CfnServiceLinkedRole(this, 'Service Linked Role', {
      awsServiceName: 'es.amazonaws.com',
    });

    const userPassword = props.domainMasterUserPassword || 'admin';
    const fineGrainedAccessControl = isFineGrained ? {
      masterUserName: props.domainMasterUserName || 'admin',
      masterUserPassword: SecretValue.unsafePlainText(userPassword),
    } : undefined;

    const domain = new opensearch.Domain(this, 'Domain', {
      domainName,
      version: opensearch.EngineVersion.OPENSEARCH_1_3,
      removalPolicy: RemovalPolicy.DESTROY,
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: true,
      },
      enforceHttps: true,
      fineGrainedAccessControl,
      logging: {
        slowSearchLogEnabled: true,
        slowIndexLogEnabled: true,
        appLogEnabled: true,
      },
      capacity: {
        dataNodeInstanceType: 't3.small.search',
        masterNodeInstanceType: 't3.small.search',
      },
      accessPolicies: [
        new iam.PolicyStatement({
          principals: [new iam.AnyPrincipal()],
          actions: ['es:*'],
          resources: [`arn:aws:es:${Stack.of(this).region}:${Stack.of(this).account}:domain/${domainName}/*`],
          // e.g. arn:aws:es:us-east-1:123456789012:domain/clusterdomain14-xxxxxxxxxxxx/*
        }),
        new iam.PolicyStatement({
          principals: [new iam.AnyPrincipal()],
          actions: ['es:*'],
          resources: [`arn:aws:es:${Stack.of(this).region}:${Stack.of(this).account}:domain/${domainName}/*`],
        }),
      ],
      ebs: {
        volumeSize: 50,
        volumeType: ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
      },
    });

    this.domain = domain;
  }
}

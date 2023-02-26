import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Domain } from 'aws-cdk-lib/aws-opensearchservice';
import { Construct } from 'constructs';
import { OpenSearchCluster } from './constructs/opensearch-cluster';

export interface OpenSearchClusterStackProps extends cdk.StackProps {
  readonly domainName: string,
  readonly isFineGrained: boolean,
  // Fine grained access control を設定する場合のユーザ名
  readonly domainMasterUserName?: string,
  // Fine grained access control を設定する場合のパスワード
  readonly domainMasterUserPassword?: string,
}

export class OpenSearchClusterStack extends cdk.Stack {
  public readonly domain: Domain;
  public readonly domainAccessRole: iam.IRole;

  constructor(scope: Construct, id: string, props: OpenSearchClusterStackProps) {
    super(scope, id, props);

    const {domainName, isFineGrained, domainMasterUserName, domainMasterUserPassword} = props;

    const cluster = new OpenSearchCluster(this, "Cluster", {
      domainName,
      isFineGrained,
      domainMasterUserName,
      domainMasterUserPassword,
    });

    // See also https://github.com/aws-samples/aws-iot-greengrass-v2-using-aws-cdk/blob/main/infra/stack/data/data-pipeline-stack.ts
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        resources: [cluster.domain.domainArn, `${cluster.domain.domainArn}/*`],
        actions: [
          'es:*',
        ]
      })
    );
    role.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: [
          's3:AbortMultipartUpload',
          's3:GetBucketLocation',
          's3:GetObject',
          's3:ListBucket',
          's3:ListBucketMultipartUploads',
          's3:PutObject',
        ]
      })
    );
    role.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: [
          'logs:PutLogEvents'
        ]
      })
    );
    cluster.domain.grantReadWrite(role);

    this.domain = cluster.domain;
    this.domainAccessRole = role;

    new CfnOutput(this, 'Delivery Stream Role', {
      value: role.roleArn,
    });
  }
}

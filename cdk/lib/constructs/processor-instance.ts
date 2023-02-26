import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import { BucketDeployment } from 'aws-cdk-lib/aws-s3-deployment';

export interface ProcessorInstanceProps {
  readonly vpc: ec2.IVpc;
  readonly deliveryStream: firehose.CfnDeliveryStream,
  readonly deploymentBucket: s3.IBucket,
  readonly deployment: BucketDeployment,
  readonly opensearchIndexName: string,
}

export class ProcessorInstance extends Construct {
  public readonly instance: ec2.Instance;

  constructor(scope: Construct, id: string, props: ProcessorInstanceProps) {
    super(scope, id);

    const { vpc, deliveryStream, deploymentBucket, deployment, opensearchIndexName } = props;

    const serviceName = 'squid-processor';
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'yum install -y git',
      // install docker
      'amazon-linux-extras install -y docker',
      'systemctl start docker',
      'systemctl enable docker',
      'usermod -a -G docker ec2-user',
      'mkdir -p /usr/local/lib/docker/cli-plugins',
      'VER=2.4.1',
      'curl \
      -L https://github.com/docker/compose/releases/download/v${VER}/docker-compose-$(uname -s)-$(uname -m) \
      -o /usr/local/lib/docker/cli-plugins/docker-compose',
      'chmod +x /usr/local/lib/docker/cli-plugins/docker-compose',
      'ln -s /usr/local/lib/docker/cli-plugins/docker-compose /usr/bin/docker-compose',

      // install Node.js: https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
      // sudo su --login ec2-user　or sudo su --login root
      `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`,
      `. /.nvm/nvm.sh`,
      `nvm install 16.19.1`,

      // install source codes
      `BUCKET_URL=${deploymentBucket.s3UrlForObject()}`,
      `aws s3 cp $BUCKET_URL/squid-processor/ ~/${serviceName} --recursive`,
      `cd ~/${serviceName} && npm ci && make build && make up`,

      // setup squid-processor service
      `cp ~/${serviceName}/systemd/${serviceName}.service /etc/systemd/system/${serviceName}.service`,
      `echo REGION=${cdk.Stack.of(this).region} >> /etc/sysconfig/${serviceName}`,
      `echo DELIVERY_STREAM_ARN=${deliveryStream.attrArn} >> /etc/sysconfig/${serviceName}`,
      `systemctl start ${serviceName}.service`,
      `systemctl enable ${serviceName}.service`,
      // log の出力: journalctl -u squid-processor

      // user data
      // url http://169.254.169.254/latest/user-data
      // user data log
      // cat /var/log/cloud-init-output.log
    );

    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      userData,
      detailedMonitoring: true,
      blockDevices: [
        {
          deviceName: '/dev/xvda',
          volume: ec2.BlockDeviceVolume.ebs(100, {
            encrypted: true
          }),
        },
      ],
    });
    instance.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
    );
    deploymentBucket.grantRead(instance);

    // S3 へのソースコードデプロイ完了後にインスタンス作成
    instance.node.addDependency(deployment);

    instance.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        resources: [deliveryStream.attrArn],
        actions: [
          'firehose:PutRecord',
          'firehose:PutRecordBatch'
        ],
      })
    );

    new CfnOutput(this, `${opensearchIndexName}-processorUrl`, {
      value: `https://${cdk.Stack.of(this).region}.console.aws.amazon.com/ec2/home?region=${cdk.Stack.of(this).region}#InstanceDetails:instanceId=${instance.instanceId}`
    });
  }
}

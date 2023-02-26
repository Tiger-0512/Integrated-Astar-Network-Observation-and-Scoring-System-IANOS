import { CfnOutput } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { IDomain } from "aws-cdk-lib/aws-opensearchservice";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface Web2FargateClusterProps {
  readonly vpc: ec2.IVpc;
  readonly domain: IDomain;
  readonly logBucket: IBucket;
  readonly grafanaPort: number;
  readonly grafanaRepositoryName: string;
  readonly grafanaApiKey: string;
  readonly nextjsPort: number;
}

export class Web2FargateCluster extends Construct {
  public readonly cluster: ecs.ICluster;

  constructor(scope: Construct, id: string, props: Web2FargateClusterProps) {
    super(scope, id);

    const { vpc, domain, logBucket, grafanaPort, grafanaRepositoryName, grafanaApiKey, nextjsPort } = props;

    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc,
      containerInsights: true,
    });

    const grafanaService = new ApplicationLoadBalancedFargateService(
      this,
      "GrafanaService",
      {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromEcrRepository(
            ecr.Repository.fromRepositoryName(
              this,
              "Repository",
              grafanaRepositoryName
            ),
            "latest"
          ),
          containerPort: grafanaPort,
        },
        listenerPort: grafanaPort,
      }
    );

    grafanaService.targetGroup.configureHealthCheck({
      port: grafanaPort.toString(),
      path: "/api/health",
    });
    grafanaService.loadBalancer.logAccessLogs(
      logBucket,
      "grafana-fargate-service-alb-access-logs"
    );
    grafanaService.loadBalancer.connections.allowFrom(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(grafanaPort)
    );
    domain.grantRead(grafanaService.taskDefinition.taskRole);

    const nextjsService = new ApplicationLoadBalancedFargateService(
      this, "NextjsService",
      {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset("../container/nextjs", {
          }),
          containerPort: nextjsPort,
          environment: {
            'GRAFANA_ENDPOINT' : grafanaService.loadBalancer.loadBalancerDnsName,
            'GRAFANA_PORT': grafanaPort.toString(),
            'GRAFANA_API_KEY': grafanaApiKey,
          },
        },
      }
    );
    nextjsService.targetGroup.configureHealthCheck({
      port: nextjsPort.toString(),
      path: "/api/healthcheck",
    });
    nextjsService.loadBalancer.logAccessLogs(
      logBucket,
      "nextjs-fargate-service-alb-access-logs"
    );

    this.cluster = cluster;

    new CfnOutput(this, "GrafanaALB DnsName", {
      value: grafanaService.loadBalancer.loadBalancerDnsName,
    });
  }
}

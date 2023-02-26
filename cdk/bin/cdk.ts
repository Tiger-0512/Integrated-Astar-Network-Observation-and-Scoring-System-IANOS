#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OnchainScoringSystemStack } from '../lib/onchain-scoring-system';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';
import { Aspects } from 'aws-cdk-lib';
import { OpenSearchClusterStack } from '../lib/opensearch-cluster-stack';

const app = new cdk.App();
// Aspects.of(app).add(new AwsSolutionsChecks());

const env: cdk.Environment = { region: 'ap-northeast-1' };

// OpenSearch Domain のユーザ名・パスワードの設定
// 適宜 Secrets Manager 等をご利用ください
// See also: https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html
const isFineGrained = true;
const domainName = 'aster-transactions';
const domainMasterUserName = 'admin';
const domainMasterUserPassword = 'admin';
const openSearchClusterStack = new OpenSearchClusterStack(app, 'OpenSearchClusterStack', {
  env,
  domainName,
  isFineGrained,
  domainMasterUserName,
  domainMasterUserPassword,
});

// Grafana のコンテナへの通信に利用するポート
// 基本的に変更不要です
const grafanaPort = 3000;
const nextjsPort = 3000;
// container/grafana/create_grafana.sh で指定するイメージ名を設定してください
const grafanaRepositoryName = 'grafana_image_with_api';
// Grafana の API キーをここに入力してください
const grafanaApiKey = '';

const scoringStack = new OnchainScoringSystemStack(app, 'OnchainScoringSystemStack', {
  env,
  domain: openSearchClusterStack.domain,
  domainAccessRole: openSearchClusterStack.domainAccessRole,
  grafanaPort,
  grafanaRepositoryName,
  grafanaApiKey,
  nextjsPort,
});

NagSuppressions.addStackSuppressions(openSearchClusterStack, [
  { id: 'AwsSolutions-IAM4', reason: 'CDK adds AWS managed policies to Lambda Functions' },
]);
NagSuppressions.addStackSuppressions(scoringStack, [
  { id: 'AwsSolutions-IAM4', reason: 'CDK adds AWS managed policies to Lambda Functions' },
]);
NagSuppressions.addStackSuppressions(openSearchClusterStack, [
  { id: 'AwsSolutions-IAM5', reason: 'CDK default policies add wildcard permissions' },
]);
NagSuppressions.addStackSuppressions(scoringStack, [
  { id: 'AwsSolutions-IAM5', reason: 'CDK default policies add wildcard permissions' },
]);
NagSuppressions.addStackSuppressions(openSearchClusterStack, [
  { id: 'AwsSolutions-L1', reason: 'CDK uses not-latest runtime for custom resources' },
]);
NagSuppressions.addStackSuppressions(scoringStack, [
  { id: 'AwsSolutions-L1', reason: 'CDK uses not-latest runtime for custom resources' },
]);

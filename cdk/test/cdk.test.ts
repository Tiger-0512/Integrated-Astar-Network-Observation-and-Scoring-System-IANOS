// run `npm test -- -u` to create snapshot
import * as cdk from 'aws-cdk-lib';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { OnchainScoringSystemStack } from '../lib/onchain-scoring-system';
import { OpenSearchClusterStack } from '../lib/opensearch-cluster-stack';

test('OpenSearchCluster Stack test', () => {
  const app = new App();
  const env: cdk.Environment = { region: 'us-east-1' };

  const isFineGrained = true;
  const domainName = 'test';

  const stack = new OpenSearchClusterStack(app, 'Stack', {
    env,
    isFineGrained,
    domainName,
  });
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
})

test('OnchainScoringSystemStack test', () => {
  const app = new cdk.App();
  const env: cdk.Environment = { region: 'us-east-1' };

  const isFineGrained = true;
  const domainName = 'test';
  const cluster = new OpenSearchClusterStack(app, 'Stack', {
    env,
    isFineGrained,
    domainName,
  });

  const grafanaPort = 3000;
  const nextjsPort = 3000;
  const grafanaRepositoryName = 'test';
  const grafanaApiKey = 'test';
  const stack = new OnchainScoringSystemStack(app, 'OnchainScoringSystemStack', {
    env,
    domain: cluster.domain,
    domainAccessRole: cluster.domainAccessRole,
    grafanaPort,
    grafanaRepositoryName,
    grafanaApiKey,
    nextjsPort,
  })

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

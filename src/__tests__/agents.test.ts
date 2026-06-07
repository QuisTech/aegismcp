import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ─── MitigationEngineer ──────────────────────────────────────────────
import { MitigationEngineer } from '../agents/MitigationEngineer.ts';
import type { MitigationInput, MitigationOutput } from '../agents/MitigationEngineer.ts';

describe('MitigationEngineer', () => {
  const engineer = new MitigationEngineer();

  it('returns YAML remediation for database-related components', async () => {
    const input: MitigationInput = {
      rootCauseComponent: 'database-service',
      suggestedStrategy: 'Auto-scale pool',
      safetyBoundaryPolicies: ['Do not edit environment schema keys'],
    };
    const result: MitigationOutput = await engineer.draftMitigation(input);

    assert.equal(result.scriptLanguage, 'yaml');
    assert.equal(result.safetyRating, 'safe');
    assert.ok(result.targetFilePath.includes('db-pool-patch.yaml'));
    assert.ok(result.remediationScript.includes('DB_MAX_CONNECTIONS'));
    assert.ok(result.dryRunLogs.length > 0);
  });

  it('returns Python remediation for cart-related components', async () => {
    const input: MitigationInput = {
      rootCauseComponent: 'cart-service',
      suggestedStrategy: 'Patch null token',
      safetyBoundaryPolicies: [],
    };
    const result: MitigationOutput = await engineer.draftMitigation(input);

    assert.equal(result.scriptLanguage, 'python');
    assert.equal(result.safetyRating, 'needs-approval');
    assert.ok(result.targetFilePath.includes('views.py'));
    assert.ok(result.remediationScript.includes('user_token'));
  });

  it('returns safe YAML fallback for unknown components', async () => {
    const input: MitigationInput = {
      rootCauseComponent: 'unknown-service',
      suggestedStrategy: 'Generic scaling',
      safetyBoundaryPolicies: [],
    };
    const result: MitigationOutput = await engineer.draftMitigation(input);

    assert.equal(result.scriptLanguage, 'yaml');
    assert.equal(result.safetyRating, 'safe');
    assert.ok(result.targetFilePath.includes('api-gateway.yaml'));
  });

  it('is case-insensitive when matching component names', async () => {
    const input: MitigationInput = {
      rootCauseComponent: 'DATABASE-Primary',
      suggestedStrategy: 'Scale connections',
      safetyBoundaryPolicies: [],
    };
    const result = await engineer.draftMitigation(input);
    assert.equal(result.scriptLanguage, 'yaml');
    assert.equal(result.safetyRating, 'safe');
  });
});

// ─── QueryStrategistAgent ────────────────────────────────────────────
import { QueryStrategistAgent } from '../agents/QueryStrategistAgent.ts';

describe('QueryStrategistAgent', () => {
  const agent = new QueryStrategistAgent();

  it('generates error-focused SPL for "500 error" prompts', async () => {
    const result = await agent.execute({
      naturalLanguagePrompt: 'Show me all 500 errors in checkout',
      activeIncidentMetadata: { serviceName: 'checkout-service', timeWindow: '-15m' },
    });

    assert.ok(result.splQuery.includes('status>=500'));
    assert.ok(result.splQuery.includes('checkout-service'));
    assert.equal(result.estimatedComplexity, 'medium');
    assert.ok(result.explanation.length > 0);
  });

  it('generates latency-focused SPL for "slow" prompts', async () => {
    const result = await agent.execute({
      naturalLanguagePrompt: 'Database queries are slow',
      activeIncidentMetadata: { serviceName: 'db-service', timeWindow: '-30m' },
    });

    assert.ok(result.splQuery.includes('latency_ms'));
    assert.ok(result.splQuery.includes('1500'));
    assert.equal(result.estimatedComplexity, 'medium');
  });

  it('falls back to generic search for unrecognized prompts', async () => {
    const result = await agent.execute({
      naturalLanguagePrompt: 'Check memory usage',
      activeIncidentMetadata: { serviceName: 'api-gateway', timeWindow: '-5m' },
    });

    assert.ok(result.splQuery.includes('index=*'));
    assert.ok(result.splQuery.includes('head 100'));
  });

  it('uses default service name when metadata is missing', async () => {
    const result = await agent.execute({
      naturalLanguagePrompt: 'Find 500 errors',
    });

    assert.ok(result.splQuery.includes('unknown-service'));
  });
});

// ─── RootCauseAnalyst ────────────────────────────────────────────────
import { RootCauseAnalyst } from '../agents/RootCauseAnalyst.ts';

describe('RootCauseAnalyst', () => {
  const analyst = new RootCauseAnalyst();

  it('identifies database pool exhaustion from TimeoutException logs', async () => {
    const result = await analyst.analyze({
      rawSplResponse: [{ exception_class: 'TimeoutException', pool_exhaustion: true }],
      systemTopologyGraph: null,
      incidentTrigger: 'High latency on checkout',
    });

    assert.equal(result.suspectedComponent, 'database-service');
    assert.ok(result.confidenceScore >= 90);
    assert.ok(result.rootCauseStatement.includes('Connection Pool'));
    assert.ok(result.evidenceLogs.length > 0);
    assert.ok(result.codeFileReference?.includes('connection_pool'));
  });

  it('identifies cart NullPointer from KeyError logs', async () => {
    const result = await analyst.analyze({
      rawSplResponse: [{ exception_class: 'NullPointerException', file: 'views.py', line: 118 }],
      systemTopologyGraph: null,
      incidentTrigger: 'Cart checkout failing',
    });

    assert.equal(result.suspectedComponent, 'cart-service');
    assert.ok(result.confidenceScore >= 85);
    assert.ok(result.rootCauseStatement.includes('Null Reference'));
    assert.ok(result.codeFileReference?.includes('views.py'));
  });

  it('falls back to api-gateway analysis for unknown patterns', async () => {
    const result = await analyst.analyze({
      rawSplResponse: [{ generic_metric: 'high_memory' }],
      systemTopologyGraph: null,
      incidentTrigger: 'Slow responses',
    });

    assert.equal(result.suspectedComponent, 'api-gateway');
    assert.equal(result.confidenceScore, 70);
    assert.ok(result.rootCauseStatement.includes('memory'));
  });
});

// ─── OrchestratorAgent (Integration) ─────────────────────────────────
import { OrchestratorAgent } from '../agents/OrchestratorAgent.ts';

describe('OrchestratorAgent', () => {
  const orchestrator = new OrchestratorAgent();

  it('orchestrates a DB-related incident end-to-end', async () => {
    const result = await orchestrator.orchestrateIncident(
      'DB-POOL-001',
      'Database connections exhausted on checkout'
    );

    assert.equal(result.incidentId, 'DB-POOL-001');
    assert.equal(result.rca.suspectedComponent, 'database-service');
    assert.equal(result.mitigation.scriptLanguage, 'yaml');
    assert.equal(result.mitigation.safetyRating, 'safe');
    assert.ok(result.finalLogs.length >= 4);
  });

  it('orchestrates a cart-related incident end-to-end', async () => {
    const result = await orchestrator.orchestrateIncident(
      'CART-ERR-002',
      'Checkout 500 errors spiking'
    );

    assert.equal(result.rca.suspectedComponent, 'cart-service');
    assert.equal(result.mitigation.scriptLanguage, 'python');
    assert.equal(result.mitigation.safetyRating, 'needs-approval');
  });

  it('calls the onStepCallback during orchestration', async () => {
    const steps: string[] = [];
    await orchestrator.orchestrateIncident(
      'TEST-003',
      'Generic error test',
      (step) => steps.push(step)
    );

    assert.ok(steps.length >= 4, `Expected at least 4 callback steps, got ${steps.length}`);
    assert.ok(steps.some(s => s.includes('Initializing')));
    assert.ok(steps.some(s => s.includes('SPL Generated')));
  });
});

import { QueryStrategistAgent } from './QueryStrategistAgent';
import { RootCauseAnalyst } from './RootCauseAnalyst';
import { MitigationEngineer } from './MitigationEngineer';

export interface OrchestratorTelemetry {
  incidentId: string;
  status: 'detecting' | 'analyzing' | 'remediating' | 'completed' | 'failed';
  logs: string[];
}

/**
 * OrchestratorAgent
 * Coordinates sub-agents, manages interactive human-in-the-loop state transitions, 
 * and publishes simulated incident outputs to Jira and Slack.
 */
export class OrchestratorAgent {
  private queryAgent = new QueryStrategistAgent();
  private analystAgent = new RootCauseAnalyst();
  private mitigationAgent = new MitigationEngineer();

  public async orchestrateIncident(
    incidentId: string, 
    triggerPrompt: string,
    onStepCallback?: (step: string, details: any) => void
  ) {
    const logs: string[] = [];
    
    const log = (msg: string) => {
      logs.push(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${msg}`);
      if (onStepCallback) {
        onStepCallback(msg, { logs: [...logs] });
      }
    };

    log(`Initializing Orchestrator for incident: ${incidentId}`);
    log('Triggering QueryStrategistAgent to compile Splunk search query...');
    
    // 1. SPL Formulation
    const splData = await this.queryAgent.execute({
      naturalLanguagePrompt: triggerPrompt,
      activeIncidentMetadata: {
        serviceName: incidentId.includes('DB') ? 'database-service' : 'cart-service',
        timeWindow: '-15m'
      }
    });
    log(`SPL Generated successfully:\n${splData.splQuery}`);

    // 2. Log Analysis & Root Cause Identification
    log('Splunk MCP query executed. Retreived raw payloads. Routing to RootCauseAnalyst...');
    
    // Injecting simulated records corresponding to query result
    const mockSplLogs = incidentId.includes('DB') 
      ? [{ exception_class: 'TimeoutException', pool_exhaustion: true }]
      : [{ exception_class: 'NullPointerException', file: 'views.py', line: 118 }];

    const rca = await this.analystAgent.analyze({
      rawSplResponse: mockSplLogs,
      systemTopologyGraph: null,
      incidentTrigger: triggerPrompt
    });
    
    log(`Root Cause Identified with ${rca.confidenceScore}% confidence: ${rca.rootCauseStatement}`);
    log(`Suspected faulty component: ${rca.suspectedComponent} (${rca.codeFileReference})`);

    // 3. Sandbox Mitigation Coding
    log('Initiating sandbox environment. MitigationEngineer drafting safe code patches...');
    const mitigation = await this.mitigationAgent.draftMitigation({
      rootCauseComponent: rca.suspectedComponent,
      codeFileReference: rca.codeFileReference,
      suggestedStrategy: 'Auto-Recover & patch state definition limits.',
      safetyBoundaryPolicies: ['Do not edit environment schema keys', 'Check syntax rules']
    });

    log(`Mitigation draft finalized for target file: ${mitigation.targetFilePath}`);
    log(`Sandbox Dry-Run completed with [${mitigation.safetyRating.toUpperCase()}] safety assessment.`);
    
    // Return compiled result payload
    return {
      incidentId,
      splData,
      rca,
      mitigation,
      finalLogs: logs
    };
  }
}
import { QueryStrategistAgent } from './QueryStrategistAgent';
import { RootCauseAnalyst } from './RootCauseAnalyst';
import { MitigationEngineer } from './MitigationEngineer';
import { SplunkMCPClient } from '../lib/SplunkMCPClient';
import { prisma } from '../lib/db';

export interface OrchestratorTelemetry {
  incidentId: string;
  status: 'detecting' | 'analyzing' | 'remediating' | 'completed' | 'failed';
  logs: string[];
}

export class OrchestratorAgent {
  private queryAgent = new QueryStrategistAgent();
  private analystAgent = new RootCauseAnalyst();
  private mitigationAgent = new MitigationEngineer();
  private splunkClient = new SplunkMCPClient();

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

    try {
      await this.splunkClient.connect();

      log(`Initializing Orchestrator for incident: ${incidentId}`);
      log('Triggering QueryStrategistAgent to compile Splunk search query using Gemini...');
      
      // 1. SPL Formulation
      const splData = await this.queryAgent.execute({
        naturalLanguagePrompt: triggerPrompt,
        activeIncidentMetadata: {
          serviceName: incidentId.includes('DB') ? 'database-service' : 'cart-service',
          timeWindow: '-15m'
        }
      });
      log(`SPL Generated successfully:\n${splData.splQuery}`);

      // 2. Real Splunk Search
      log('Executing query against real Splunk MCP Server...');
      const splunkResponse = await this.splunkClient.searchLogs(splData.splQuery, '-15m');
      
      // Extract the raw log data, adapting depending on the MCP server's response format
      const mockSplLogs = splunkResponse.results || splunkResponse;

      // 3. Log Analysis & Root Cause Identification
      log('Splunk results retrieved. Routing to RootCauseAnalyst and Gemini for RCA...');
      const rca = await this.analystAgent.analyze({
        rawSplResponse: mockSplLogs,
        incidentTrigger: triggerPrompt
      });
      
      log(`Root Cause Identified with ${rca.confidenceScore}% confidence: ${rca.rootCauseStatement}`);
      log(`Suspected faulty component: ${rca.suspectedComponent} (${rca.codeFileReference})`);

      // 4. Mitigation Drafting
      log('Initiating sandbox environment. MitigationEngineer drafting safe code patches via Gemini...');
      const mitigation = await this.mitigationAgent.draftMitigation({
        rootCauseComponent: rca.suspectedComponent,
        codeFileReference: rca.codeFileReference,
        suggestedStrategy: 'Auto-Recover & patch state definition limits.',
        safetyBoundaryPolicies: ['Do not edit environment schema keys', 'Check syntax rules']
      });

      log(`Mitigation draft finalized for target file: ${mitigation.targetFilePath}`);
      log(`Sandbox Dry-Run completed with [${mitigation.safetyRating.toUpperCase()}] safety assessment.`);
      
      // 5. Database Persistence
      log('Saving incident record and audit trail to database (Prisma)...');
      await prisma.incident.create({
        data: {
          id: incidentId,
          splunkQuery: splData.splQuery,
          rootCause: rca.rootCauseStatement,
          remediationApplied: mitigation.proposedCodeDiff,
          timestamp: new Date()
        }
      });

      return {
        incidentId,
        splData,
        rca,
        mitigation,
        finalLogs: logs
      };
    } catch (error: any) {
      log(`Incident orchestration failed: ${error.message}`);
      throw error;
    }
  }
}
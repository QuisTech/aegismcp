import { QueryStrategistAgent } from './QueryStrategistAgent';
import { RootCauseAnalyst } from './RootCauseAnalyst';
import { MitigationEngineer } from './MitigationEngineer';
import { SplunkMCPClient } from '../lib/SplunkMCPClient';
import { SplunkService } from '../lib/SplunkService';

export interface OrchestratorTelemetry {
  incidentId: string;
  status: 'detecting' | 'analyzing' | 'remediating' | 'completed' | 'failed';
  logs: string[];
}

export class OrchestratorAgent {
  private queryAgent = new QueryStrategistAgent();
  private analystAgent = new RootCauseAnalyst();
  private mitigationAgent = new MitigationEngineer();
  private splunkMCPClient = new SplunkMCPClient();
  private splunkRESTService = new SplunkService();

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
      // 1. SPL Formulation
      log(`Initializing Orchestrator for incident: ${incidentId}`);
      log('Triggering QueryStrategistAgent to compile Splunk search query using Gemini...');
      const splData = await this.queryAgent.execute({
        naturalLanguagePrompt: triggerPrompt,
        activeIncidentMetadata: {
          serviceName: incidentId.includes('DB') ? 'database-service' : 'cart-service',
          timeWindow: '-15m'
        }
      });
      log(`SPL Generated successfully:\n${splData.splQuery}`);

      // 2. Real Splunk Search
      let mockSplLogs: any[] = [];
      
      // Try Cloud/REST API first if configured (required for Vercel)
      if (process.env.SPLUNK_HOST && process.env.SPLUNK_USERNAME) {
        log('Executing query against real Splunk Cloud via REST API...');
        const restResults = await this.splunkRESTService.executeSearch(splData.splQuery);
        mockSplLogs = restResults;
      } else {
        // Fallback to local MCP stdio server
        log('Executing query against local Splunk MCP Server...');
        await this.splunkMCPClient.connect();
        const splunkResponse = await this.splunkMCPClient.searchLogs(splData.splQuery, '-15m');
        
        mockSplLogs = Array.isArray(splunkResponse.results) 
          ? splunkResponse.results 
          : Array.isArray(splunkResponse) 
            ? splunkResponse 
            : [splunkResponse];
      }

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
      log('Saving incident record and audit trail (Mocked for Vercel deployment)...');
      // In a full production environment, we would save to Postgres here.

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
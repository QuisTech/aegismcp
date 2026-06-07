import { GeminiClient } from '../lib/GeminiClient';

export interface RootCauseAnalystInput {
  rawSplResponse: any[];
  systemTopologyGraph?: any;
  incidentTrigger: string;
}

export interface RootCauseAnalystOutput {
  rootCauseStatement: string;
  confidenceScore: number;
  suspectedComponent: string;
  codeFileReference: string;
}

export class RootCauseAnalyst {
  private gemini = new GeminiClient();

  public async analyze(input: RootCauseAnalystInput): Promise<RootCauseAnalystOutput> {
    const prompt = `
      You are an expert Site Reliability Engineer (SRE) and Root Cause Analyst.
      Analyze the following actual Splunk query results related to an incident triggered by: "${input.incidentTrigger}"
      
      Splunk Logs:
      ${JSON.stringify(input.rawSplResponse, null, 2)}
      
      Identify the root cause, confidence score, suspected component, and the likely file where the issue resides.
      
      Return ONLY a JSON block with the following structure (no markdown fences):
      {
        "rootCauseStatement": "...",
        "confidenceScore": 95,
        "suspectedComponent": "...",
        "codeFileReference": "..."
      }
    `;

    try {
      const responseText = await this.gemini.generateContent(prompt);
      const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);

      return {
        rootCauseStatement: parsed.rootCauseStatement || 'Unable to determine root cause from logs.',
        confidenceScore: parsed.confidenceScore || 50,
        suspectedComponent: parsed.suspectedComponent || 'Unknown',
        codeFileReference: parsed.codeFileReference || 'Unknown'
      };
    } catch (error) {
      console.error('Error analyzing root cause:', error);
      return {
        rootCauseStatement: 'Error parsing Gemini response or API failure.',
        confidenceScore: 0,
        suspectedComponent: 'Unknown',
        codeFileReference: 'Unknown'
      };
    }
  }
}
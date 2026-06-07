import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = 'gemini-2.0-flash-exp';
  }

  async generateContent(prompt: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Using mock response.');
      return this.mockGenerateContent(prompt);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error calling Gemini:', error);
      throw error;
    }
  }

  private mockGenerateContent(prompt: string): string {
    if (prompt.includes('SPL')) {
      return JSON.stringify({
        splQuery: 'index=production_microservices status>=500 | stats count by endpoint',
        targetIndices: ['production_microservices'],
        estimatedComplexity: 'low',
        explanation: 'Mock generated SPL query due to missing Gemini API Key.'
      });
    }
    if (prompt.includes('Root Cause Analyst')) {
      return JSON.stringify({
        rootCauseStatement: 'Mock Analysis: The issue appears to be related to a database timeout.',
        confidenceScore: 85,
        suspectedComponent: 'checkout-service',
        codeFileReference: 'src/db/pool.py'
      });
    }
    return JSON.stringify({
      targetFilePath: 'src/db/pool.py',
      proposedCodeDiff: '+ # Mock fix applied',
      safetyRating: 'safe',
      revertCommand: 'git checkout -- src/db/pool.py',
      sandboxTestResults: 'Mock tests passed.'
    });
  }
}

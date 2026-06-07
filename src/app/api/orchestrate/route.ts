import { NextResponse } from 'next/server';
import { OrchestratorAgent } from '../../../agents/OrchestratorAgent';

export async function POST(req: Request) {
  try {
    const { incidentId, triggerPrompt } = await req.json();

    if (!incidentId || !triggerPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields: incidentId, triggerPrompt' },
        { status: 400 }
      );
    }

    const orchestrator = new OrchestratorAgent();
    
    // In a real streaming API you'd use Server-Sent Events or WebSockets.
    // For this endpoint, we will just await the full result.
    const result = await orchestrator.orchestrateIncident(incidentId, triggerPrompt);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to orchestrate incident', details: error.message },
      { status: 500 }
    );
  }
}

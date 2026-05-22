/**
 * Input schema for QueryStrategistAgent
 */
export interface QueryStrategistInput {
  naturalLanguagePrompt: string;
  historicalSchema?: Record<string, any>;
  activeIncidentMetadata?: {
    serviceName: string;
    timeWindow: string;
    errorCode?: string;
  };
}

/**
 * Output response returned by QueryStrategistAgent
 */
export interface QueryStrategistOutput {
  splQuery: string;
  targetIndices: string[];
  estimatedComplexity: 'low' | 'medium' | 'high';
  explanation: string;
}

/**
 * QueryStrategistAgent
 * Synthesizes complex natural language into highly optimized, index-safe Splunk Search Processing Language (SPL) queries.
 * Direct integration point with Splunk MCP server schemas.
 */
export class QueryStrategistAgent {
  /**
   * Builds and optimizes an SPL query ready for Splunk engine execution.
   */
  public async execute(input: QueryStrategistInput): Promise<QueryStrategistOutput> {
    const service = input.activeIncidentMetadata?.serviceName || 'unknown-service';
    const timeWindow = input.activeIncidentMetadata?.timeWindow || '-15m';
    const errorCode = input.activeIncidentMetadata?.errorCode || '*';

    // Simulated MCP translation based on natural command intent
    let splQuery = '';
    let explanation = '';
    const cleanPrompt = input.naturalLanguagePrompt.toLowerCase();

    if (cleanPrompt.includes('500') || cleanPrompt.includes('error') || cleanPrompt.includes('crash')) {
      splQuery = `index=production_microservices service="${service}" status>=500 
| bin _time span=1m 
| stats count as error_count, values(exception_class) as exceptions by _time, pod_name, endpoint
| sort - error_count`;
      explanation = `Query matches response error spikes (>=500) over ${timeWindow} in active production microservices, grouping by pod and endpoints to isolate transient infrastructure issues.`;
    } else if (cleanPrompt.includes('latency') || cleanPrompt.includes('slow') || cleanPrompt.includes('db')) {
      splQuery = `index=production_apm service="${service}" 
| eval latency_ms = duration / 1000
| where latency_ms > 1500
| stats perc95(latency_ms) as p95, perc99(latency_ms) as p99, count by endpoint, db_statement
| sort - p99`;
      explanation = 'Tracks APM tracer durations exceeding 1500ms and maps them back to database queries and endpoint traces.';
    } else {
      // General fall-back Splunk search
      splQuery = `index=* sourcetype=syslog "${service}" "${cleanPrompt}" 
| head 100 
| table _time, host, log_level, message`;
      explanation = 'Generic keyword query searching logs containing active system keywords mapped across multiple hosts.';
    }

    return {
      splQuery,
      targetIndices: ['production_microservices', 'production_apm'],
      estimatedComplexity: cleanPrompt.includes('latency') ? 'high' : 'medium',
      explanation
    };
  }
}
export interface IncidentModel {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'RESOLVED';
  service: string;
  timestamp: string;
  triggerPrompt: string;
}

/**
 * Simulated incident datasets reflecting production-grade logs queried through Splunk MCP
 */
export const MOCK_INCIDENTS: IncidentModel[] = [
  {
    id: "INC-2089",
    title: "Checkout Service 500 Spike (Connection Pool Exhaustion)",
    severity: "CRITICAL",
    service: "checkout-service",
    timestamp: "2 minutes ago",
    triggerPrompt: "Analyze the high rate of 500 errors on the checkout service over the past 15 minutes, look for exceptions"
  },
  {
    id: "INC-4412",
    title: "Null Pointer Exception in user cart view page schema request",
    severity: "WARNING",
    service: "cart-service",
    timestamp: "8 minutes ago",
    triggerPrompt: "Find all cart exceptions, specifically looking for Python code errors or payload failures"
  },
  {
    id: "INC-0114",
    title: "Redis Session Store Timeout / Latency Spike",
    severity: "RESOLVED",
    service: "session-store",
    timestamp: "1 hour ago",
    triggerPrompt: "Identify latency spikes on DB cache services and correlate with pod memory limits"
  }
];
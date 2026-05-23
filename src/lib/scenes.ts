export interface Scene {
  id: string;
  name: string;
  route: '/' | '/dashboard';
  duration: number; // Duration of narration/playback in ms
  description: string;
}

export const AEGIS_SCENES: Scene[] = [
  {
    id: 'hero',
    name: 'Unified Portal Entry',
    route: '/',
    duration: 12000,
    description: 'Welcome to AegisMCP - Autonomous SRE War-Rooms. Renders the hero panel and mock terminal.'
  },
  {
    id: 'agent-query-strategist',
    name: 'QueryStrategist Agent',
    route: '/',
    duration: 14000,
    description: 'Walkthrough: QueryStrategist translates intents into optimized Splunk SPL queries.'
  },
  {
    id: 'agent-root-cause-analyst',
    name: 'RootCauseAnalyst Agent',
    route: '/',
    duration: 14000,
    description: 'Walkthrough: RootCauseAnalyst constructs system dependency maps and isolates faults.'
  },
  {
    id: 'agent-mitigation-engineer',
    name: 'MitigationEngineer Agent',
    route: '/',
    duration: 14000,
    description: 'Walkthrough: MitigationEngineer designs and dry-runs isolated container patches safely.'
  },
  {
    id: 'dashboard-initial',
    name: 'Incident War-Room Entrance',
    route: '/dashboard',
    duration: 10000,
    description: 'Entered the Autonomous Incident console displaying detected high-severity alerts.'
  },
  {
    id: 'incident-select',
    name: 'Triage Alert Isolation',
    route: '/dashboard',
    duration: 8000,
    description: 'Cursor focuses on the Checkout Service 500 Spike incident.'
  },
  {
    id: 'incident-analysis',
    name: 'Splunk Querying & Trace Topology',
    route: '/dashboard',
    duration: 22000,
    description: 'Autonomous agents query Splunk SPL logs and construct the crimson service topology map.'
  },
  {
    id: 'sandbox-dryrun',
    name: 'Sandbox Mitigation Dry-Run',
    route: '/dashboard',
    duration: 18000,
    description: 'Mitigation sandbox terminal stdout dry-run and safety audit log visibility.'
  },
  {
    id: 'remediation-applied',
    name: 'Remediation Applied & Self-Healing',
    route: '/dashboard',
    duration: 14000,
    description: 'One-click rollout applied, incident status turns green, system returns to operational posture.'
  }
];

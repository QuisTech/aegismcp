# AegisMCP — Architecture Diagram

## System Architecture

```mermaid
graph TD
    classDef core fill:#0f172a,stroke:#06b6d4,stroke-width:3px,color:#fff,font-weight:bold
    classDef agent fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fcd34d
    classDef mcp fill:#1e293b,stroke:#10b981,stroke-width:2px,color:#a7f3d0,stroke-dasharray:5 5
    classDef output fill:#334155,stroke:#ef4444,stroke-width:2px,color:#fecaca
    classDef ui fill:#334155,stroke:#8b5cf6,stroke-width:2px,color:#c4b5fd

    %% User Layer
    U["SRE / DevOps Operator"]:::ui

    %% Frontend
    subgraph Frontend ["Next.js Command Center"]
        F1["Incident War Room Dashboard"]:::ui
        F2["Live Reasoning Log"]:::ui
        F3["APM Topology Map"]:::ui
        F4["Sandbox Terminal"]:::ui
    end

    %% Orchestrator
    O["OrchestratorAgent"]:::core

    %% Specialist Agents
    subgraph Agents ["Multi-Agent Autonomy Engine"]
        A1["QueryStrategist"]:::agent
        A2["RootCauseAnalyst"]:::agent
        A3["MitigationEngineer"]:::agent
    end

    %% MCP Layer
    subgraph MCP ["Model Context Protocol Layer"]
        M1("Splunk MCP Server"):::mcp
        M2("Docker Sandbox MCP"):::mcp
    end

    %% Infrastructure
    subgraph Infra ["Infrastructure"]
        I1("Splunk Cloud / Enterprise"):::mcp
        I2("Kubernetes Cluster"):::mcp
        I3("Production Services"):::mcp
    end

    %% Outputs
    subgraph Actions ["Autonomous Resolutions"]
        R1("Optimized SPL Queries"):::output
        R2("Root Cause Reports"):::output
        R3("Sandboxed Patches"):::output
        R4("Production Rollouts"):::output
    end

    %% Connections
    U --> F1
    F1 --> O
    F2 -.-> O
    F3 -.-> A2
    F4 -.-> A3

    O <--> A1
    O <--> A2
    O <--> A3

    A1 --> |"MCP Tool Call"| M1
    A3 --> |"MCP Tool Call"| M2
    M1 --> I1
    M2 --> I2

    A1 --> R1
    A2 --> R2
    A3 --> R3
    R3 --> |"SRE Approval"| R4
    R4 --> I3
```

## Data Flow

1. **Incident Detection** → Active alerts are ingested from Splunk into the War Room Dashboard.
2. **Query Synthesis** → The `QueryStrategist` translates natural language into optimized SPL via the Splunk MCP Server.
3. **Root Cause Isolation** → The `RootCauseAnalyst` correlates log patterns and APM traces to pinpoint the fault.
4. **Sandboxed Remediation** → The `MitigationEngineer` compiles a patch and dry-runs it in an isolated Docker sandbox via MCP.
5. **Production Rollout** → After SRE approval, the validated fix is deployed to the production Kubernetes cluster.

## Agent Communication

| Agent | MCP Tool | Input | Output |
|-------|----------|-------|--------|
| QueryStrategist | `splunk_search` | Natural language + schema | Optimized SPL query |
| RootCauseAnalyst | `splunk_results` | Raw log data + APM traces | Fault isolation report |
| MitigationEngineer | `docker_sandbox` | Root cause + code context | Validated remediation patch |
| Orchestrator | All tools | Agent telemetry | Coordinated pipeline state |

"use client";

import React, { useState } from "react";
import {
  Play,
  AlertCircle,
  CheckCircle,
  ShieldAlert,
  RefreshCw,
  BookOpen,
  ExternalLink
} from "lucide-react";
import { OrchestratorAgent } from "@/agents/OrchestratorAgent";
import { MOCK_INCIDENTS, IncidentModel } from "@/lib/mcp";
import AgentStatusHUD from "@/components/AgentStatusHUD";
import TopologyMap from "@/components/TopologyMap";
import LiveReasoningLog from "@/components/LiveReasoningLog";
import MitigationSandboxTerminal from "@/components/MitigationSandboxTerminal";

export default function Dashboard() {
  const [incidents, setIncidents] = useState<IncidentModel[]>(MOCK_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<IncidentModel>(MOCK_INCIDENTS[0]);
  const [currentStep, setCurrentStep] = useState<"idle" | "querying" | "analyzing" | "remediating" | "completed" | "failed">("idle");

  // Orchestrated payloads states
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [splQuery, setSplQuery] = useState<string>("");
  const [rcaExplanation, setRcaExplanation] = useState<string>("");
  const [remediationScript, setRemediationScript] = useState<string>("");
  const [dryRunLogs, setDryRunLogs] = useState<string[]>([]);
  const [safetyRating, setSafetyRating] = useState<"safe" | "needs-approval" | "dangerous">("safe");
  const [targetFilePath, setTargetFilePath] = useState<string>("");
  const [remediationApplied, setRemediationApplied] = useState<boolean>(false);

  React.useEffect(() => {
    const handleSceneChange = (e: Event) => {
      const sceneId = (e as CustomEvent).detail.id;
      console.log(`🎬 [Dashboard] Reacting to scene: ${sceneId}`);

      if (sceneId === 'dashboard-initial') {
        setIncidents(MOCK_INCIDENTS);
        setSelectedIncident(MOCK_INCIDENTS[0]);
        setCurrentStep("idle");
        setPipelineLogs([]);
        setSplQuery("");
        setRcaExplanation("");
        setRemediationScript("");
        setDryRunLogs([]);
        setRemediationApplied(false);
      } else if (sceneId === 'incident-select') {
        setSelectedIncident(MOCK_INCIDENTS[0]);
        setCurrentStep("idle");
        setPipelineLogs([]);
        setSplQuery("");
        setRcaExplanation("");
        setRemediationScript("");
        setDryRunLogs([]);
        setRemediationApplied(false);
      } else if (sceneId === 'incident-analysis') {
        setCurrentStep("querying");
        setPipelineLogs([
          "[QueryStrategist] Connected to Splunk MCP Server index metadata...",
          "[QueryStrategist] Analyzing index 'microservices' schema fields...",
          "[QueryStrategist] Synthesizing optimized SPL query limiting thread lockups..."
        ]);
        setSplQuery("");
        setRcaExplanation("");
        setRemediationScript("");
        setDryRunLogs([]);
        setRemediationApplied(false);
        
        const t1 = setTimeout(() => {
          setCurrentStep("analyzing");
          setPipelineLogs(prev => [
            ...prev,
            "[QueryStrategist] Splunk SPL executed successfully in 120ms.",
            "[RootCauseAnalyst] Mapping downstream service traces from index...",
            "[RootCauseAnalyst] Constructed 2D APM Topology map highlighting 'cart-service' in critical status.",
            "[RootCauseAnalyst] Located anomalous database unclosed cursor loop inside pool.py."
          ]);
          setSplQuery("index=microservices status>=500 \n| stats count by pod_name, exception");
          setRcaExplanation("Identified database transaction thread leak inside src/db/pool.py:L42. Connections are staying open because the cursor loop fails to close under concurrent checkout spikes.");
        }, 5000);

        return () => clearTimeout(t1);
      } else if (sceneId === 'sandbox-dryrun') {
        setCurrentStep("remediating");
        setPipelineLogs(prev => [
          ...prev,
          "[MitigationEngineer] Compiling python connection pool patch script...",
          "[MitigationEngineer] Instantiating isolated Kubernetes Docker sandbox container..."
        ]);
        setSplQuery("index=microservices status>=500 \n| stats count by pod_name, exception");
        setRcaExplanation("Identified database transaction thread leak inside src/db/pool.py:L42. Connections are staying open because the cursor loop fails to close under concurrent checkout spikes.");
        setRemediationScript(
          "# Secure fix: database connection pool cursor release\n" +
          "try:\n" +
          "    cursor = conn.cursor()\n" +
          "    cursor.execute(query)\n" +
          "    result = cursor.fetchall()\n" +
          "finally:\n" +
          "    cursor.close()  # Prevents thread leakage\n" +
          "    conn.close()"
        );
        setDryRunLogs([
          "[Sandbox] Spinning up isolated python:3.11-slim container...",
          "[Sandbox] Injecting pool.py with proposed remediation patch...",
          "[Sandbox] Running concurrency regression test (500 virtual threads)...",
          "[Sandbox] Result: 100% throughput, 0 leaks detected.",
          "[Sandbox] Security Audit: Safe (No external network requests, zero CVE alerts)."
        ]);
        setSafetyRating("safe");
        setTargetFilePath("src/db/pool.py");
        setRemediationApplied(false);
      } else if (sceneId === 'remediation-applied') {
        setIncidents((prev) =>
          prev.map((inc) =>
            inc.id === MOCK_INCIDENTS[0].id ? { ...inc, severity: "RESOLVED" } : inc
          )
        );
        setRemediationApplied(true);
        setCurrentStep("completed");
        setPipelineLogs(prev => [
          ...prev,
          "[MitigationEngineer] SRE approval received. Triggering rolling rollout cluster update...",
          "[MitigationEngineer] Deployment rollout completed successfully.",
          "[MitigationEngineer] Active incidents resolved. Restored system operational posture."
        ]);
      }
    };

    window.addEventListener('aegis-scene-change', handleSceneChange);
    return () => window.removeEventListener('aegis-scene-change', handleSceneChange);
  }, [incidents, selectedIncident]);

  const triggerAgentPipeline = async (incident: IncidentModel) => {
    setCurrentStep("querying");
    setPipelineLogs([]);
    setSplQuery("");
    setRemediationScript("");
    setRemediationApplied(false);

    const orchestrator = new OrchestratorAgent();
    try {
      const result = await orchestrator.orchestrateIncident(
        incident.id,
        incident.triggerPrompt,
        (currentLogLine, stateMeta) => {
          setPipelineLogs(stateMeta.logs);
          // Progress step state simulation dynamically
          if (currentLogLine.includes("Executing")) {
            setCurrentStep("analyzing");
          } else if (currentLogLine.includes("Initiating sandbox")) {
            setCurrentStep("remediating");
          }
        }
      );

      // Capture compiled outputs from model agent state definitions
      setSplQuery(result.splData.splQuery);
      setRcaExplanation(result.splData.explanation);
      setRemediationScript(result.mitigation.remediationScript);
      setDryRunLogs(result.mitigation.dryRunLogs);
      setSafetyRating(result.mitigation.safetyRating);
      setTargetFilePath(result.mitigation.targetFilePath);
      setCurrentStep("completed");
    } catch (error) {
      console.error(error);
      setCurrentStep("failed");
    }
  };

  const handleApplyRemediation = () => {
    setRemediationApplied(true);
    // update state in mock database
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === selectedIncident.id ? { ...inc, severity: "RESOLVED" } : inc
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8 flex-grow">
      {/* Top Banner and Summary stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Autonomous War-Room
          </h1>
          <p className="text-zinc-400 text-sm">
            Investigate microservice crashes, run queries, and execute auto-remediation via Splunk MCP
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-center">
            <p className="text-[10px] text-zinc-500 font-mono uppercase">Active Alerts</p>
            <p className="text-lg font-bold text-rose-500">2</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-center">
            <p className="text-[10px] text-zinc-500 font-mono uppercase">Avg. MTT Resolution</p>
            <p className="text-lg font-bold text-emerald-400">1.8 min</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-center">
            <p className="text-[10px] text-zinc-500 font-mono uppercase">Remediation Success Rate</p>
            <p className="text-lg font-bold text-accentCyan">98.4%</p>
          </div>
        </div>
      </div>

      {/* Split dashboard workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Sidebar: Incident Select Queue */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div data-scene="dashboard-initial" className="bg-bgSecondary/80 border border-borderMuted/80 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-200 text-sm">Detected Alerts</h3>
              <button className="text-xs text-accentCyan hover:underline flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            <div className="space-y-3">
              {incidents.map((inc) => {
                const isSelected = inc.id === selectedIncident.id;
                const severityColor = 
                  inc.severity === "CRITICAL" 
                    ? "border-rose-500/30 bg-rose-950/20 text-rose-400" 
                    : inc.severity === "WARNING"
                    ? "border-amber-500/30 bg-amber-950/20 text-amber-400"
                    : "border-emerald-500/30 bg-emerald-950/20 text-emerald-400";

                return (
                  <div
                    key={inc.id}
                    data-scene={isSelected ? "incident-select" : undefined}
                    onClick={() => {
                      setSelectedIncident(inc);
                      setCurrentStep("idle");
                      setPipelineLogs([]);
                      setSplQuery("");
                      setRemediationScript("");
                    }}
                    className={`border rounded-lg p-3.5 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? "border-accentCyan bg-zinc-900/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                        : "border-borderMuted hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-zinc-500">{inc.id}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${severityColor}`}>
                        {inc.severity}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-zinc-100 mb-1 leading-snug">
                      {inc.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-zinc-400 mt-2">
                      <span>Service: {inc.service}</span>
                      <span>{inc.timestamp}</span>
                    </div>
                  </div>
                );
              })} 
            </div>
          </div>

          {/* Incident Details Card & Trigger action button */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-xl p-5 space-y-4">
            <div>
              <span className="text-xs font-mono text-accentCyan uppercase tracking-wider">Selected Incident Context</span>
              <h3 className="text-lg font-bold text-white mt-1">{selectedIncident.title}</h3>
            </div>

            <div className="text-xs text-zinc-400 space-y-2.5 font-mono">
              <div>
                <span className="text-zinc-500">PROMPT:</span>
                <p className="bg-zinc-950 p-2.5 rounded border border-zinc-800 text-zinc-300 mt-1 leading-relaxed">
                  {selectedIncident.triggerPrompt}
                </p>
              </div>
              <div>
                <span className="text-zinc-500">TARGET CLUSTER:</span>
                <p className="text-zinc-300">k8s-us-west-prod-03</p>
              </div>
            </div>

            <button
              disabled={currentStep !== "idle" && currentStep !== "completed" && currentStep !== "failed"}
              onClick={() => triggerAgentPipeline(selectedIncident)}
              className="w-full py-3 px-4 rounded-lg bg-accentCyan text-black font-semibold text-sm hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-500 shadow-[0_4px_20px_rgba(6,182,212,0.25)]"
            >
              <Play className="w-4 h-4 fill-black" />
              {currentStep === "idle" ? "Initiate Autonomous War-Room" : "Restart Investigation"}
            </button>
          </div>
        </div>

        {/* Main Workspace Workspace Dashboard: Dynamic SRE Hub */}
        <div data-scene="incident-analysis" className="xl:col-span-8 flex flex-col gap-6">
          {/* Agent Status HUD */}
          <AgentStatusHUD currentStep={currentStep} />

          {/* Incident Topology Map */}
          <TopologyMap faultyService={selectedIncident.service} status={currentStep} />

          {/* Split workspace block: Terminal Logs & Mitigations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <LiveReasoningLog 
                logs={pipelineLogs} 
                splQuery={splQuery} 
                rcaExplanation={rcaExplanation}
              />
            </div>
          </div>

          {/* Mitigation Code Patch Panel */}
          <div data-scene="sandbox-dryrun" className="w-full">
            <MitigationSandboxTerminal 
              remediationScript={remediationScript}
              scriptLanguage={selectedIncident.service === "cart-service" ? "python" : "yaml"}
              dryRunLogs={dryRunLogs}
              safetyRating={safetyRating}
              targetFilePath={targetFilePath}
              onApplyRemediation={handleApplyRemediation}
              isApplied={remediationApplied}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
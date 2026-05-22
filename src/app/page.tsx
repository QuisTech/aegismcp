"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Shield, 
  Terminal, 
  Layers, 
  Cpu, 
  Zap, 
  Settings, 
  FileText, 
  Radio,
  CheckSquare
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"query" | "rca" | "mitigate">("query");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12 w-full">
        <div className="flex-1 space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-accentCyan/30 text-accentCyan text-xs font-semibold tracking-wide">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Autonomous SRE Remediation & Observability
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Demolish MTTR with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accentCyan via-emerald-400 to-teal-400">Autonomous War-Rooms</span>
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed">
            AegisMCP is an intelligent, multi-agent remediation engine integrated directly with your Splunk MCP server. Write queries, synthesize APM trace logic, and run container patches automatically with secure sandbox verification.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-accentCyan to-teal-500 text-black font-semibold hover:brightness-110 shadow-[0_4px_24px_rgba(6,182,212,0.3)] flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              Enter Incident War Room <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center justify-center gap-2 transition-all"
            >
              <Terminal className="w-4 h-4" /> View Core Tech Stack
            </a>
          </div>
        </div>

        {/* Right Pane: Interactive Mock Terminal Showcase */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <div className="absolute inset-0 bg-accentCyan/10 rounded-2xl blur-3xl -z-10" />
          <div className="border border-zinc-800 bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl">
            {/* Terminal Top bar */}
            <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-zinc-500">Aegis Agent Engine Trace - live-stream</span>
            </div>

            {/* Terminal Body */}
            <div className="p-5 font-mono text-xs space-y-4 text-zinc-300 min-h-[340px]">
              <div className="text-zinc-500 flex justify-between border-b border-zinc-900 pb-2">
                <span>AGENT PIPELINE SEQUENCE</span>
                <span className="text-accentCyan">CPU LOAD: 12%</span>
              </div>

              <p className="text-zinc-500">$ aegis-mcp analyze --incident INC-2089</p>
              <p className="text-cyan-400">[QueryStrategist] Synthesized Splunk SPL Query:</p>
              <pre className="bg-zinc-900 p-3 rounded text-zinc-400 border border-zinc-800 overflow-x-auto">
                {`index=microservices status>=500 
| stats count by pod_name, exception`}
              </pre>
              <p className="text-amber-400">[RootCauseAnalyst] Identified db transaction thread leak inside src/db/pool.py:L42.</p>
              <p className="text-emerald-400">[MitigationEngineer] Applied YAML configuration deployment patch to Kubernetes sandbox dry-run environment. Status: PASSED (100% throughput).</p>
              <div className="pt-3 flex justify-between items-center text-xs text-zinc-400 border-t border-zinc-900">
                <span>Remediation Confidence: 98.2%</span>
                <span className="text-emerald-400 font-bold">PROPOSED RESOLVED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Bento Grid Tech Features */}
      <section className="bg-bgSecondary/40 py-16 border-t border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Architected for High-Severity Incidents
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Reduce MTTR from hours to seconds with specialized LLM Agents targeting your operational runtime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 relative overflow-hidden group">
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Splunk MCP Integration</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Translates natural user intents into performant Splunk Search Processing Language (SPL) queries directly against schema definitions without table-scans.
              </p>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            </div>

            {/* Bento Card 2 */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 relative overflow-hidden group">
              <div className="p-3 rounded-lg bg-accentCyan/10 text-accentCyan w-fit mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Agent Reasoning</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Separate specialized agents handle query formulation, log correlation, dependency modeling, sandbox mitigation design, and Slack/Jira syndication workflows.
              </p>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accentCyan/5 rounded-full blur-2xl group-hover:bg-accentCyan/10 transition-colors" />
            </div>

            {/* Bento Card 3 */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 relative overflow-hidden group">
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sandboxed Mitigation Dry-Run</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Ensures code security. Proposed Kubernetes configs or deployment updates are validated in isolated Docker sandboxes before SRE review and deployment approvals.
              </p>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* Agent Technical Spec Tab Explainer */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-white">Under the Hood</h2>
          <p className="text-sm text-zinc-400 mt-2">
            Explore the sequence architecture executing each automated war-room response.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex justify-center border-b border-zinc-800 mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("query")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${ 
              activeTab === "query" ? "border-accentCyan text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            QueryStrategist
          </button>
          <button
            onClick={() => setActiveTab("rca")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${ 
              activeTab === "rca" ? "border-accentCyan text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            RootCauseAnalyst
          </button>
          <button
            onClick={() => setActiveTab("mitigate")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${ 
              activeTab === "mitigate" ? "border-accentCyan text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            MitigationEngineer
          </button>
        </div>

        {/* Tab Panels with content rendering */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 max-w-4xl mx-auto min-h-[300px] flex flex-col justify-between">
          {activeTab === "query" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm">
                <Settings className="w-4 h-4" /> SECURE SPL SYNTHESIS
              </div>
              <h3 className="text-2xl font-bold text-white">Transforms natural queries to index-safe execution paths</h3>
              <p className="text-zinc-400 leading-relaxed">
                Most SRE operators waste valuable triage minutes searching for logs manually. The QueryStrategist analyzes your historical index schemas dynamically from active Splunk MCP context parameters to limit CPU overhead. It enforces safety boundaries like time limits, preventing massive full-table scan lockups.
              </p>
              <div className="bg-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 border border-zinc-800">
                <strong>Inputs:</strong> Prompt string, historical schema keys, time-range constraint.<br />
                <strong>Outputs:</strong> Optimized executable Splunk SPL query metadata.
              </div>
            </div>
          )}

          {activeTab === "rca" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-sm">
                <Zap className="w-4 h-4" /> MULTI-TRACE CORRELATION
              </div>
              <h3 className="text-2xl font-bold text-white">Pinpoint bugs directly to line-level files</h3>
              <p className="text-zinc-400 leading-relaxed">
                By evaluating log patterns, microservice interaction traces, and APM error logs returned by Splunk, the RootCauseAnalyst isolates failures. It constructs complex system dependency graphs, mapping downstream failures directly to the line of code or container spec responsible.
              </p>
              <div className="bg-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 border border-zinc-800">
                <strong>Inputs:</strong> Splunk raw logs search stream, APM tracing dependency charts.<br />
                <strong>Outputs:</strong> Suspected system files, exception triggers, confidence scoring indexes.
              </div>
            </div>
          )}

          {activeTab === "mitigate" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
                <Shield className="w-4 h-4" /> SECURE ENVIRONMENT ROLLOUTS
              </div>
              <h3 className="text-2xl font-bold text-white">Generates automated code and config patches</h3>
              <p className="text-zinc-400 leading-relaxed">
                Rather than just alerting you that a service has crashed, AegisMCP writes mitigation scripts (such as scaling deployment sizes, reverting faulty config yaml definitions, or introducing Python schema validations) and runs them inside isolated sandboxes to log regressions before production rollout.
              </p>
              <div className="bg-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 border border-zinc-800">
                <strong>Inputs:</strong> Fault metadata target reference, file schema rules, boundary constraints.<br />
                <strong>Outputs:</strong> Remediating patch script code, validation terminal logs.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
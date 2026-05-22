"use client";

import React from "react";
import {
  Search,
  Cpu,
  Wrench,
  Workflow,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface AgentStatusHUDProps {
  currentStep: "idle" | "querying" | "analyzing" | "remediating" | "completed" | "failed";
}

export default function AgentStatusHUD({ currentStep }: AgentStatusHUDProps) {
  const steps = [
    {
      id: "querying",
      name: "QueryStrategist",
      role: "Splunk SPL synthesis",
      icon: Search,
      color: "text-sky-400",
      borderColor: "border-sky-500/30",
      activeBg: "bg-sky-950/40"
    },
    {
      id: "analyzing",
      name: "RootCauseAnalyst",
      role: "Trace & Log correlation",
      icon: Cpu,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      activeBg: "bg-amber-950/40"
    },
    {
      id: "remediating",
      name: "MitigationEngineer",
      role: "Sandbox patch execution",
      icon: Wrench,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      activeBg: "bg-emerald-950/40"
    }
  ];

  const isStepDone = (stepId: string) => {
    const sequence = ["querying", "analyzing", "remediating", "completed"];
    const currentIdx = sequence.indexOf(currentStep);
    const stepIdx = sequence.indexOf(stepId);
    return currentIdx > stepIdx;
  };

  return (
    <div className="bg-bgSecondary/80 border border-borderMuted/80 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Workflow className="w-5 h-5 text-accentCyan" />
          <h3 className="font-bold text-gray-200 tracking-tight">Orchestration Engine Core</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-accentCyan animate-pulse" />
          <span className="text-xs text-zinc-400 font-mono">MCP Server Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((s) => {
          const IconComponent = s.icon;
          const isActive = currentStep === s.id;
          const isDone = isStepDone(s.id);

          return (
            <div
              key={s.id}
              className={`relative border rounded-lg p-4 transition-all duration-300 ${
                isActive 
                  ? `${s.borderColor} ${s.activeBg} ring-1 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]` 
                  : isDone
                  ? "border-emerald-500/20 bg-zinc-900/40"
                  : "border-borderMuted/40 bg-zinc-900/10 opacity-60"
              }`}
            >
              {/* Header inside single card */}
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-xs font-mono font-medium ${s.color} bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800`}>
                  {s.name}
                </span>
                {isActive ? (
                  <Loader2 className="w-4 h-4 text-accentCyan animate-spin" />
                ) : isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700" />
                )}
              </div>

              <p className="text-sm font-semibold text-zinc-100 mb-0.5">{s.role}</p>
              <p className="text-xs text-zinc-500">
                {isActive 
                  ? "Actively processing metadata triggers..." 
                  : isDone 
                  ? "Step finished. Telemetry locked." 
                  : "Awaiting pipeline orchestration."}
              </p>

              {/* Highlight bar */}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-accentCyan rounded-b-lg shadow-[0_-2px_6px_rgba(6,182,212,1)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
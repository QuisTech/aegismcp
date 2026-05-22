"use client";

import React from "react";
import { Shield, Play, Terminal, Eye, FileCheck, CheckCircle2 } from "lucide-react";

interface MitigationSandboxTerminalProps {
  remediationScript?: string;
  scriptLanguage?: string;
  dryRunLogs?: string[];
  safetyRating?: "safe" | "needs-approval" | "dangerous";
  targetFilePath?: string;
  onApplyRemediation: () => void;
  isApplied: boolean;
}

export default function MitigationSandboxTerminal({
  remediationScript,
  scriptLanguage = "yaml",
  dryRunLogs = [],
  safetyRating = "safe",
  targetFilePath = "patch.yaml",
  onApplyRemediation,
  isApplied
}: MitigationSandboxTerminalProps) {
  return (
    <div className="bg-bgSecondary/80 border border-borderMuted/80 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-gray-200">Mitigation Sandbox Terminal</h3>
        </div>
        {remediationScript && (
          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
            safetyRating === "safe" 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
          }`}>
            {safetyRating} rating
          </span>
        )}
      </div>

      {!remediationScript ? (
        <div className="h-[380px] border border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-center p-6 text-zinc-500">
          <Terminal className="w-10 h-10 text-zinc-700 mb-2" />
          <p className="text-sm font-semibold text-zinc-400">No Mitigation Proposed Yet</p>
          <p className="text-xs max-w-sm mt-1">
            Once the RootCauseAnalyst identifies the fault model, the MitigationEngineer will render and dry-run code changes here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[380px]">
          {/* Left pane: Remediating Patch preview */}
          <div className="flex flex-col border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
            <div className="bg-zinc-900 px-3 py-2 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs font-mono text-zinc-300">Target: {targetFilePath}</span>
              </div>
              <span className="text-[10px] uppercase font-mono bg-zinc-800 px-1.5 py-0.5 text-zinc-400 rounded">
                {scriptLanguage}
              </span>
            </div>
            <pre className="p-3 flex-grow overflow-auto font-mono text-xs text-emerald-400 leading-relaxed bg-zinc-950">
              {remediationScript}
            </pre>
          </div>

          {/* Right pane: Dry run logs + action cta */}
          <div className="flex flex-col border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
            <div className="bg-zinc-900 px-3 py-2 border-b border-zinc-800">
              <span className="text-xs font-mono text-zinc-300">Local Sandbox Verification Tests</span>
            </div>
            <div className="p-3 flex-grow overflow-auto font-mono text-xs text-zinc-400 space-y-1">
              {dryRunLogs.map((logLine, idx) => (
                <p key={idx} className={logLine.includes("success") || logLine.includes("Passed") ? "text-emerald-400" : ""}>
                  {logLine}
                </p>
              ))}
            </div>

            <div className="p-3 bg-zinc-900/60 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Aegis safety filters configured.</span>
              </div>
              
              <button
                disabled={isApplied}
                onClick={onApplyRemediation}
                className={`w-full sm:w-auto px-4 py-2 rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  isApplied 
                    ? "bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed" 
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:brightness-110 active:scale-95 shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
                }`}
              >
                {isApplied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Remediation Applied
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-black" />
                    Click to Apply and Rollout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
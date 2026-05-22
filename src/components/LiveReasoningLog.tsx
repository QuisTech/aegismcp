"use client";

import React, { useRef, useEffect } from "react";
import { Terminal, Copy, Check } from "lucide-react";

interface LiveReasoningLogProps {
  logs: string[];
  splQuery?: string;
  rcaExplanation?: string;
}

export default function LiveReasoningLog({
  logs,
  splQuery,
  rcaExplanation
}: LiveReasoningLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopy = () => {
    if (splQuery) {
      navigator.clipboard.writeText(splQuery);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-bgSecondary/80 border border-borderMuted/80 rounded-xl p-6 flex flex-col h-[520px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-accentCyan" />
          <h3 className="font-bold text-gray-200">Autonomous Reasoning Trace</h3>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded">
          Live MCP Pipeline Logs
        </span>
      </div>

      {/* Logs container */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto bg-zinc-950 border border-zinc-900 rounded-lg p-4 font-mono text-xs space-y-2 mb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
      >
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
            <p>Ready to observe. Trigger or select an incident above to start tracking real-time agent execution logs.</p>
          </div>
        ) : (
          logs.map((log, index) => {
            let color = "text-zinc-300";
            if (log.includes("ERROR") || log.includes("TimeoutException")) color = "text-rose-400";
            else if (log.includes("SPL Generated")) color = "text-cyan-400 font-semibold";
            else if (log.includes("Root Cause Identified")) color = "text-amber-400 font-semibold";
            else if (log.includes("Remediation")) color = "text-emerald-400";

            return (
              <div key={index} className={`leading-relaxed whitespace-pre-wrap ${color}`}>
                {log}
              </div>
            );
          })
        )}
      </div>

      {/* Dynamic SPL query extracted display */}
      {splQuery && (
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3.5 font-mono text-xs">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-zinc-500 font-bold uppercase text-[10px]">Splunk SPL Synthesized Query</span>
            <button
              onClick={handleCopy}
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="bg-zinc-900/60 text-cyan-400 p-2.5 rounded border border-zinc-800/80 overflow-x-auto">
            {splQuery}
          </pre>
          {rcaExplanation && (
            <p className="text-zinc-400 text-[11px] mt-2 italic">
              <strong>Analysis strategy:</strong> {rcaExplanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
"use client";

import React from "react";
import { Server, Database, Network, ArrowRight, ShieldAlert, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface TopologyMapProps {
  faultyService: string;
  status: string;
}

export default function TopologyMap({ faultyService, status }: TopologyMapProps) {
  const nodes = [
    { id: "gateway", name: "API Gateway", type: "gateway", icon: Network, status: "healthy" },
    { id: "auth", name: "Auth Service", type: "service", icon: Server, status: "healthy" },
    { 
      id: "cart", 
      name: "Cart Service", 
      type: "service", 
      icon: Server, 
      status: faultyService === "cart-service" && status !== "completed" ? "degraded" : "healthy" 
    },
    { 
      id: "db", 
      name: "Postgres DB Cluster", 
      type: "database", 
      icon: Database, 
      status: faultyService === "database-service" && status !== "completed" ? "degraded" : "healthy" 
    }
  ];

  return (
    <div className="bg-bgSecondary/80 border border-borderMuted/80 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accentCyan/5 rounded-full blur-3xl -z-10" />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-200">Incident Topology Mapping</h3>
          <p className="text-xs text-gray-500">Dynamic traceroutes gathered by Splunk APM agent server</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Healthy
          </span>
          <span className="flex items-center gap-1 text-rose-500">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping" /> Degraded
          </span>
        </div>
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-around gap-8 py-8 px-4 border border-zinc-900 bg-zinc-950/30 rounded-lg">
        {nodes.map((node, idx) => {
          const NodeIcon = node.icon;
          const isDegraded = node.status === "degraded";
          
          return (
            <React.Fragment key={node.id}>
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`relative p-5 rounded-xl border flex flex-col items-center gap-3 w-40 text-center transition-all duration-300 ${
                  isDegraded 
                    ? "border-rose-500/50 bg-rose-950/20 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-pulse"
                    : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700"
                }`}
              >
                <div className={`p-2.5 rounded-lg ${
                  isDegraded ? "bg-rose-500/20 text-rose-400" : "bg-zinc-800 text-accentCyan"
                }`}>
                  <NodeIcon className="w-6 h-6" />
                </div>
                
                <div>
                  <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">{node.type}</p>
                  <p className="text-sm font-semibold text-white">{node.name}</p>
                </div>

                {isDegraded ? (
                  <div className="absolute -top-2.5 -right-2 bg-rose-500 text-white p-1 rounded-full">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="absolute -top-2.5 -right-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 p-0.5 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
              
              {idx < nodes.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-zinc-700">
                  <ArrowRight className={`w-5 h-5 ${isDegraded ? "text-rose-400 animate-pulse" : ""}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Shield, Radio, Layers, Activity } from "lucide-react";
import SceneController from "@/components/SceneController";

import PageTransitionProvider from "@/components/PageTransitionProvider";

export const metadata: Metadata = {
  title: "AegisMCP - Autonomous Incident Resolution & Observability Copilot",
  description: "Autonomous incident war-room and remediation engine powered by Splunk MCP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bgPrimary text-gray-100 font-sans min-h-screen flex flex-col selection:bg-accentCyan selection:text-black">
        <SceneController />
        {/* Global Glow Header Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-gradient-to-b from-accentCyan/10 via-transparent to-transparent blur-3xl -z-10 pointer-events-none" />

        <header className="border-b border-borderMuted/80 bg-bgSecondary/60 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-accentCyan/20 to-emerald-500/20 border border-accentCyan/30 group-hover:border-accentCyan transition-colors">
                <Shield className="w-5 h-5 text-accentCyan group-hover:text-emerald-400 transition-colors" />
              </div>
              <div>
                <span className="font-bold tracking-tight text-lg text-white">
                  Aegis<span className="text-accentCyan">MCP</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  v1.2.0-mcp-alpha
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                Incident War Room
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-800 px-3 py-1.5 rounded bg-zinc-900 transition-all"
              >
                <Radio className="w-3.5 h-3.5 text-accentCyan animate-pulse" />
                Splunk MCP Connected
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-grow flex flex-col">
          <PageTransitionProvider>
            {children}
          </PageTransitionProvider>
        </main>

        <footer className="border-t border-borderMuted/80 bg-bgSecondary/40 py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accentCyan" />
              <p className="text-xs text-gray-500">
                AegisMCP &copy; {new Date().getFullYear()} — Built for high-speed SRE & SecOps.
              </p>
            </div>
            <div className="flex gap-6 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Splunk Integration</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Security Sandbox Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">API Spec</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
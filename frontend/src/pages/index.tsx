import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Sparkles, Check, Code2, Zap, Shield, Globe,
  Search, Brain, Layers, Database, ThumbsUp, ThumbsDown,
  GripVertical, FileText, Presentation, ChevronUp, ChevronDown,
  Trash2, AlignLeft, List, Type, WrapText, Download, LayoutTemplate,
  BookOpen, Hash, Bold, Italic, Underline, ListOrdered, PanelLeft
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

// ─── Custom Premium SVG Icons ────────────────────────────────────────────────
const RAGIcon = (p: any) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <defs>
      <linearGradient id="rag1" x1="0" y1="0" x2="48" y2="48">
        <stop stopColor="#3B82F6"/><stop offset="1" stopColor="#8B5CF6"/>
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="22" stroke="url(#rag1)" strokeWidth="1.5" strokeOpacity="0.4" fill="url(#rag1)" fillOpacity="0.07"/>
    <path d="M24 9C24 9 15 17 15 24C15 31 24 39 24 39C24 39 33 31 33 24C33 17 24 9 24 9Z" stroke="url(#rag1)" strokeWidth="2" />
    <path d="M9 24H39" stroke="url(#rag1)" strokeWidth="1.5" strokeDasharray="3 5" strokeOpacity="0.5"/>
    <circle cx="24" cy="24" r="3.5" fill="#60A5FA"/>
    <circle cx="33" cy="14" r="2.5" fill="#A78BFA"/>
    <circle cx="15" cy="34" r="2.5" fill="#A78BFA"/>
    <path d="M24 24L33 14M24 24L15 34" stroke="url(#rag1)" strokeWidth="1.5" strokeOpacity="0.7"/>
  </svg>
);

const ContextIcon = (p: any) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <defs>
      <linearGradient id="ctx1" x1="0" y1="0" x2="48" y2="48">
        <stop stopColor="#A855F7"/><stop offset="1" stopColor="#EC4899"/>
      </linearGradient>
    </defs>
    <rect x="8" y="10" width="32" height="28" rx="5" stroke="url(#ctx1)" strokeWidth="1.5" fill="url(#ctx1)" fillOpacity="0.08"/>
    <rect x="14" y="17" width="28" height="22" rx="4" stroke="url(#ctx1)" strokeWidth="1.5" fill="#09090b"/>
    <path d="M20 26H36M20 32H30" stroke="url(#ctx1)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7"/>
    <circle cx="38" cy="10" r="3.5" fill="#F472B6"/>
    <circle cx="8" cy="38" r="3.5" fill="#C084FC"/>
    <path d="M38 10Q38 24 8 38" stroke="url(#ctx1)" strokeWidth="1.5" strokeDasharray="3 4" fill="none" strokeOpacity="0.5"/>
  </svg>
);

const RefineIcon = (p: any) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <defs>
      <linearGradient id="ref1" x1="0" y1="0" x2="48" y2="48">
        <stop stopColor="#10B981"/><stop offset="1" stopColor="#3B82F6"/>
      </linearGradient>
    </defs>
    <path d="M18 34L36 16" stroke="url(#ref1)" strokeWidth="4" strokeLinecap="round"/>
    <path d="M10 40L18 34" stroke="url(#ref1)" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.35"/>
    <path d="M36 16L40 12" stroke="url(#ref1)" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.35"/>
    <path d="M28 8L33 12L36 8L39 12L44 14L39 16L36 22L33 16L28 8Z" fill="url(#ref1)"/>
  </svg>
);

const ExportIcon = (p: any) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <defs>
      <linearGradient id="exp1" x1="0" y1="0" x2="48" y2="48">
        <stop stopColor="#F59E0B"/><stop offset="1" stopColor="#EF4444"/>
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="28" height="26" rx="4" stroke="url(#exp1)" strokeWidth="2" fill="url(#exp1)" fillOpacity="0.09"/>
    <path d="M24 14V30M24 30L17 23M24 30L31 23" stroke="url(#exp1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 40H38" stroke="url(#exp1)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.6"/>
  </svg>
);

// ─── Tiny helper: Skeleton line ───────────────────────────────────────────────
const Sk = ({ w = 'w-full', op = 'bg-white/10' }: { w?: string; op?: string }) => (
  <div className={`h-2 rounded-full ${w} ${op}`} />
);

// ─── RAG Mockup ───────────────────────────────────────────────────────────────
function RAGMockup() {
  const sources = [
    { domain: 'iea.org', title: 'Global EV Outlook 2024', score: 97, color: 'text-blue-400', bgDot: 'bg-blue-500' },
    { domain: 'statista.com', title: 'EV Market Share by Region', score: 93, color: 'text-purple-400', bgDot: 'bg-purple-500' },
    { domain: 'reuters.com', title: 'Battery Cost Trends Q3 2024', score: 88, color: 'text-sky-400', bgDot: 'bg-sky-500' },
  ];
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden shadow-2xl text-xs flex flex-col h-full">
      {/* Header bar */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 py-3 border-b border-white/8 bg-white/[0.03] shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_6px_rgba(59,130,246,0.9)]" />
          Web Research Pipeline
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2 text-[10px] text-white/40 font-mono flex-wrap justify-end">
          <span>google_cse</span>
          <span className="text-white/20">›</span>
          <span>faiss_embed</span>
          <span className="text-white/20">›</span>
          <span className="text-green-400">synthesis</span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4 flex-1">
        {/* Toggle row */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-white/80 text-[11px] sm:text-xs">Enhance with Web Research</span>
          </div>
          <div className="w-9 h-5 rounded-full bg-blue-500 flex items-center justify-end pr-0.5 shadow-[0_0_10px_rgba(59,130,246,0.5)] shrink-0">
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>

        {/* Sources */}
        <div>
          <div className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-2 px-1 flex justify-between">
            <span>Top Sources</span>
            <span className="hidden sm:inline">FAISS Score</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sources.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/8 ${i === 2 ? 'hidden sm:flex' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${s.bgDot} shrink-0 hidden sm:block`} />
                <Globe className={`w-3 h-3 ${s.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[9px] text-white/40 truncate">{s.domain}</div>
                  <div className="font-semibold text-white/80 text-[10px] sm:text-[11px] truncate">{s.title}</div>
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-green-400 shrink-0 bg-green-500/10 px-1.5 py-0.5 rounded">{s.score}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Generated block with citations */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] p-3 mt-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span className="text-[9px] sm:text-[10px] font-bold text-blue-400 uppercase tracking-widest">Generating Content</span>
            </div>
          </div>
          <div className="space-y-2">
            <Sk w="w-full" op="bg-white/10" />
            <Sk w="w-[91%]" op="bg-white/10" />
            <div className="flex flex-wrap items-center gap-1.5 py-0.5">
              <span className="inline-flex items-center gap-1 text-[9px] bg-blue-500/20 border border-blue-500/30 text-blue-300 px-1.5 py-0.5 rounded font-mono">[iea.org]</span>
            </div>
            <Sk w="w-[96%]" op="bg-white/10" />
            <div className="flex flex-wrap items-center gap-1.5 py-0.5">
              <span className="inline-flex items-center gap-1 text-[9px] bg-purple-500/20 border border-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded font-mono">[statista.com]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Context Awareness Mockup ─────────────────────────────────────────────────
function ContextMockup() {
  const sections = [
    { n: 1, title: 'Executive Summary', words: 350, done: true },
    { n: 2, title: 'Market Landscape', words: 500, done: true },
    { n: 3, title: 'Growth Drivers', words: 450, done: true },
    { n: 4, title: 'Competitive Analysis', words: 480, done: false, active: true },
    { n: 5, title: 'Risk Factors', words: 400, done: false },
  ];
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden shadow-2xl text-xs flex flex-col h-full">
      {/* Context badge */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/[0.03]">
        <Brain className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Full Document Context</span>
        <div className="ml-auto text-[10px] text-white/30 font-mono hidden sm:block">DOCX</div>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1 flex flex-col">
        {/* Section list */}
        <div className="flex-1 flex flex-col justify-center gap-2">
          {sections.map((s) => (
            <div
              key={s.n}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg border transition-all ${
                s.active
                  ? 'border-purple-500/50 bg-purple-500/10 shadow-[inset_0_0_20px_rgba(168,85,247,0.05)]'
                  : 'border-white/8 bg-white/[0.02]'
              }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold font-mono shrink-0 hidden sm:flex ${
                s.done ? 'bg-green-500/20 text-green-400' : s.active ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)]' : 'bg-white/5 text-white/30'
              }`}>{s.n}</div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-[10px] sm:text-[11px] truncate ${s.active ? 'text-white' : 'text-white/50'}`}>{s.title}</div>
              </div>
              {s.active && (
                <div className="hidden sm:block text-[9px] font-bold text-purple-300 bg-purple-500/15 px-1.5 py-0.5 rounded shrink-0">
                  ← Generating
                </div>
              )}
              <div className={`text-[9px] font-mono shrink-0 ${s.active ? 'text-purple-300' : 'text-white/25'}`}>{s.words}w</div>
            </div>
          ))}
        </div>
        {/* Context feed */}
        <div className="mt-1 rounded-xl bg-white/[0.03] border border-white/8 p-3 space-y-1.5 shrink-0">
          <div className="text-[9px] uppercase font-bold text-white/25 tracking-widest mb-2">Context Fed to AI</div>
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-white/50"><Hash className="w-3 h-3 text-purple-400 shrink-0"/>Adjacent: <span className="text-white/70 font-mono hidden sm:inline">"Growth Drivers"</span> <span className="text-white/70 font-mono truncate">"Risk Factors"</span></div>
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-white/50"><BookOpen className="w-3 h-3 text-purple-400 shrink-0"/>Refinement history: 3 reactions loaded</div>
        </div>
      </div>
    </div>
  );
}

// ─── Refinement Mockup ────────────────────────────────────────────────────────
function RefineMockup() {
  const history = [
    { msg: 'Make this concise', reaction: 'liked', output: 'Condensed 480 → 320w' },
    { msg: 'Use technical language', reaction: 'liked', output: 'Tone adjusted' },
  ];
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden shadow-2xl text-xs flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/[0.03]">
        <RefineIcon className="w-4 h-4"/>
        <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Refinement History</span>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
        <div className="flex flex-col gap-3">
          {/* History log */}
          {history.map((h, i) => (
            <div key={i} className={`rounded-xl border p-3 ${
              h.reaction === 'liked' ? 'border-green-500/20 bg-green-500/[0.05]' : 'border-red-500/20 bg-red-500/[0.04]'
            }`}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-white/50 min-w-0">
                  <Type className="w-3 h-3 shrink-0"/>
                  <span className="truncate">&ldquo;{h.msg}&rdquo;</span>
                </div>
                {h.reaction === 'liked'
                  ? <ThumbsUp className="w-3.5 h-3.5 text-green-500 shrink-0"/>
                  : <ThumbsDown className="w-3.5 h-3.5 text-red-400 shrink-0"/>}
              </div>
              <div className={`text-[9px] sm:text-[10px] font-semibold ${h.reaction === 'liked' ? 'text-green-400' : 'text-red-400'}`}>{h.output}</div>
            </div>
          ))}
        </div>
        {/* Active prompt */}
        <div className="mt-auto pt-2 shrink-0">
          <div className="text-[9px] uppercase font-bold text-white/20 tracking-widest mb-2">New Instruction</div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/15">
            <WrapText className="w-3.5 h-3.5 text-white/30 shrink-0"/>
            <span className="text-[10px] sm:text-[11px] text-white/60 font-mono italic flex-1 truncate">Add a transition spacing_</span>
            <div className="w-1.5 h-3.5 bg-white/60 rounded-sm animate-pulse shrink-0"/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Outline + Flow Mockup ─────────────────────────────────────────────────────
function OutlineMockup() {
  const outline = [
    { n: 1, title: 'Executive Summary', w: 350 },
    { n: 2, title: 'Market Landscape & Trends', w: 500 },
    { n: 3, title: 'Competitive Analysis', w: 450 },
    { n: 4, title: 'Go-To-Market Strategy', w: 480 },
    { n: 5, title: 'Financial Projections', w: 400 },
  ];
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden shadow-2xl text-xs h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/[0.03]">
        <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400"/>
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">AI Outline</span>
        <div className="ml-auto hidden sm:flex gap-1.5 text-[9px] font-bold bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/25">Generated</div>
      </div>
      <div className="p-4 flex flex-col gap-2.5 flex-1 justify-center">
        {outline.map((s) => (
          <div key={s.n} className="flex items-center gap-2.5 px-2.5 py-2.5 sm:py-2 rounded-lg bg-white/[0.03] border border-white/8 group hover:border-indigo-500/20 transition-colors">
            <GripVertical className="w-3 h-3 text-white/20 shrink-0 hidden sm:block"/>
            <div className="w-4 h-4 rounded bg-indigo-500/20 flex items-center justify-center text-[9px] font-bold text-indigo-400 shrink-0 font-mono">{s.n}</div>
            <div className="flex-1 font-semibold text-[10px] sm:text-[11px] text-white/70 truncate">{s.title}</div>
            <div className="text-[9px] font-mono text-white/30 shrink-0 hidden md:block">{s.w}w</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Export Mockup ─────────────────────────────────────────────────────────────
function ExportMockup() {
  const themes = [
    { name: 'Professional', bg: 'bg-slate-800', border: 'border-slate-600', accent: 'bg-blue-500', text: 'text-slate-200' },
    { name: 'Academic', bg: 'bg-zinc-100', border: 'border-zinc-300', accent: 'bg-amber-600', text: 'text-zinc-800' },
    { name: 'Modern', bg: 'bg-zinc-950', border: 'border-zinc-700', accent: 'bg-violet-500', text: 'text-zinc-100' },
    { name: 'Creative', bg: 'bg-amber-50', border: 'border-amber-200', accent: 'bg-orange-500', text: 'text-amber-900' },
  ];
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden shadow-2xl text-xs h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/[0.03]">
        <ExportIcon className="w-4 h-4"/>
        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Export</span>
      </div>
      <div className="p-4 flex flex-col gap-4 flex-1">
        {/* Format row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 px-2 sm:px-3 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0"/>
            <div className="truncate">
              <div className="font-bold text-white/80 text-[10px] sm:text-[11px]">DOCX</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2 sm:px-3 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <Presentation className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400 shrink-0"/>
            <div className="truncate">
              <div className="font-bold text-white/80 text-[10px] sm:text-[11px]">PPTX</div>
            </div>
          </div>
        </div>
        {/* Theme grid */}
        <div className="mt-auto">
          <div className="text-[9px] uppercase font-bold text-white/25 tracking-widest mb-2">PPTX Themes</div>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((t, i) => (
              <div key={i} className={`${t.bg} ${t.border} border rounded-xl p-2 sm:p-2.5 flex flex-col gap-1.5 hover:scale-[1.02] transition-transform`}>
                <div className="flex items-center justify-between">
                  <div className={`text-[9px] sm:text-[10px] font-bold ${t.text}`}>{t.name}</div>
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm ${t.accent} shrink-0`}/>
                </div>
                <div className={`h-1 w-3/4 ${t.accent} rounded-full opacity-70`}/>
                <div className={`h-1 bg-black/20 w-full rounded-full opacity-30`}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero App Mockup ───────────────────────────────────────────────────────────
function HeroMockup() {
  return (
    <div className="w-full rounded-[1.5rem] sm:rounded-[2rem] border border-white/12 bg-[#0A0D11] overflow-hidden shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)] flex flex-col h-[400px] sm:h-[450px]">
      {/* Chrome / Mac Dots Header */}
      <div className="h-10 border-b border-white/10 bg-[#050709] flex items-center px-4 gap-4 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"/>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"/>
          <div className="w-3 h-3 rounded-full bg-green-500/80"/>
        </div>
        <div className="flex-1 bg-white/[0.04] rounded-md border border-white/10 h-6 flex items-center justify-center gap-2 max-w-[200px] sm:max-w-xs mx-auto text-white/30 hidden sm:flex">
          <Shield className="w-3 h-3"/>
          <span className="text-[10px] font-mono tracking-wide">app.docbuilder.ai</span>
        </div>
      </div>
      
      {/* WYSIWYG Header / Toolbar */}
      <div className="flex items-center justify-between border-b border-white/8 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
           <div className="hidden sm:flex items-center gap-2 text-white/60 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-md hover:bg-white/10 cursor-default shrink-0">
             <PanelLeft className="w-4 h-4" />
           </div>
           <div className="h-4 w-[1px] bg-white/10 hidden sm:block shrink-0" />
           <div className="flex items-center gap-2 sm:gap-3 shrink-0">
             <span className="text-[11px] sm:text-xs font-semibold text-white/80">Q4 Market Analysis</span>
             <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[9px] font-bold uppercase border border-green-500/20">Saved</span>
           </div>
        </div>
        
        <div className="hidden md:flex items-center gap-3 text-white/40 border border-white/10 rounded-lg p-1 bg-[#050709] shrink-0">
           <div className="flex gap-1 px-1">
             <div className="p-1 rounded hover:bg-white/10 hover:text-white cursor-default"><Bold className="w-3.5 h-3.5" /></div>
             <div className="p-1 rounded hover:bg-white/10 hover:text-white cursor-default"><Italic className="w-3.5 h-3.5" /></div>
             <div className="p-1 rounded hover:bg-white/10 hover:text-white cursor-default"><Underline className="w-3.5 h-3.5" /></div>
           </div>
           <div className="w-[1px] h-3 bg-white/10" />
           <div className="flex gap-1 px-1">
             <div className="p-1 rounded hover:bg-white/10 hover:text-white cursor-default"><List className="w-3.5 h-3.5" /></div>
             <div className="p-1 rounded hover:bg-white/10 hover:text-white cursor-default"><ListOrdered className="w-3.5 h-3.5" /></div>
           </div>
        </div>
      </div>

      {/* Body: Sidebar + Editor */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar (Outline) */}
        <div className="hidden md:flex w-48 bg-[#050709]/50 border-r border-white/8 flex-col shrink-0">
           <div className="p-4 border-b border-white/5">
             <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Document Outline</div>
             <div className="flex flex-col gap-1.5">
               {['Executive Summary', 'Market Analysis', 'Regulatory Risks', 'Financial Projections'].map((s, i) => (
                 <div key={i} className={`text-[11px] px-2.5 py-2 rounded-lg flex items-center justify-between border ${i === 1 ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' : 'text-white/50 border-transparent hover:bg-white/5'}`}>
                   <span className="truncate">{s}</span>
                   {i === 1 && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />}
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-5 sm:p-8 flex flex-col gap-4 sm:gap-6 overflow-hidden relative bg-[#0d1117]">
          
          <div className="max-w-2xl w-full h-full flex flex-col mx-auto">
            {/* Context/RAG Pill */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 uppercase tracking-wide">
                <Search className="w-3 h-3" />
                Live Web Research Active
              </div>
            </div>

            {/* Document Title Component */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 mb-4 tracking-tight">Market Analysis & Projections</h1>
            
            {/* Fake Content Generation */}
            <div className="flex-1 space-y-3 relative">
              <Sk w="w-full" op="bg-white/10"/>
              <motion.div animate={{width:['0%','94%']}} transition={{duration:1.5,ease:'easeOut'}} className="h-2 rounded-full bg-white/10"/>
              
              <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                <span className="text-[10px] sm:text-[12px] text-blue-300 bg-blue-500/20 border border-blue-500/30 rounded px-1.5 min-w-[60px] h-4 inline-flex items-center justify-center font-mono">
                  [iea.org]
                </span>
              </div>
              
              <motion.div animate={{width:['0%','86%']}} transition={{duration:1.5,delay:0.3,ease:'easeOut'}} className="h-2 rounded-full bg-white/10"/>
              <motion.div animate={{width:['0%','99%']}} transition={{duration:1.5,delay:0.5,ease:'easeOut'}} className="h-2 rounded-full bg-white/10"/>
              
              <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                <span className="text-[10px] sm:text-[12px] text-purple-300 bg-purple-500/20 border border-purple-500/30 rounded px-1.5 min-w-[80px] h-4 inline-flex items-center justify-center font-mono">
                  [statista.com]
                </span>
              </div>

              <motion.div animate={{width:['0%','72%']}} transition={{duration:1.5,delay:0.7,ease:'easeOut'}} className="h-2 rounded-full bg-white/10"/>

              {/* Floating AI Panel */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 1.5 }} 
                className="absolute bottom-4 right-0 left-0 sm:left-auto sm:w-64 bg-[#1A1D24] border border-white/10 rounded-xl p-3 shadow-2xl flex items-center gap-3 backdrop-blur-md z-10 mx-2 sm:mx-0"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30 text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Editor AI</div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-blue-500 rounded-full" animate={{width:['0%','100%']}} transition={{duration:2, repeat:Infinity}} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary" style={{ background: '#050709' }}>

      {/* ── Navbar ── */}
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-white/6 backdrop-blur-xl bg-[#050709]/80">
        <div className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2 text-white">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400"/>
          <span className="hidden sm:inline">DocBuilder AI</span>
          <span className="sm:hidden">DocBuilder</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-medium text-white/40 hover:text-white transition-colors">Login</Link>
          <Link href="/register">
            <button className="bg-white text-black font-bold text-xs px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-white/90 transition-all shadow-lg hover:scale-[1.02] whitespace-nowrap">
              Get Started Free
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="container mx-auto px-4 sm:px-6 pt-12 pb-10 md:pt-24 md:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Text */}
          <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:.5}} className="lg:w-[46%] flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-6 sm:mb-8 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0"/>
              Llama 3.3 70B · Real-Time RAG
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter mb-5 sm:mb-7 leading-[1.05] text-white">
              Documents<br className="hidden sm:block"/> that think.<br/>
              <span className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Research that's{'\u00A0'}real.
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/45 mb-8 sm:mb-10 leading-relaxed max-w-lg">
              The only structured AI document builder with live web research, full outline context awareness, and natural language refinement. Not hallucinations — verified facts with auditable source URLs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white text-black font-black text-sm sm:text-base px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl hover:scale-[1.03] transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2">
                  Start Building Free <ArrowRight className="w-4 h-4 shrink-0"/>
                </button>
              </Link>
            </div>
            <div className="mt-8 flex gap-4 sm:gap-8 text-[9px] sm:text-[10px] text-white/30 font-bold uppercase tracking-widest border-t border-white/8 pt-6 sm:pt-8 w-full justify-center lg:justify-start">
              <span className="flex items-center gap-1 sm:gap-1.5"><Check className="w-3.5 h-3.5 text-blue-500 shrink-0"/>Free Forever</span>
              <span className="flex items-center gap-1 sm:gap-1.5"><Check className="w-3.5 h-3.5 text-blue-400 shrink-0"/>No Card Needed</span>
            </div>
          </motion.div>

          {/* Right — Hero Mockup */}
          <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{duration:.5,delay:.2}} className="lg:w-[54%] w-full relative pt-4 lg:pt-0">
            <div className="absolute inset-0 bg-blue-500/15 blur-[80px] sm:blur-[120px] rounded-full -z-10"/>
            <HeroMockup/>
          </motion.div>
        </div>
      </section>

      {/* ── Tech Strip ── */}
      <div className="border-y border-white/6 py-3 sm:py-4 mb-16 sm:mb-24 bg-white/[0.015]">
        <div className="container mx-auto px-4 sm:px-6 flex justify-start sm:justify-center items-center gap-6 sm:gap-16 text-[10px] sm:text-[11px] text-white/25 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {[
            ['LangChain', Code2],['Groq / Llama', Zap],['Google CSE', Search],['Firebase', Shield],['Next.js', Database]
          ].map(([label, Icon]: any, i) => (
            <span key={i} className="flex items-center gap-1.5 font-bold uppercase tracking-wider whitespace-nowrap">
              <Icon className="w-3 h-3 shrink-0"/>{label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bento Grid ── */}
      <section className="container mx-auto px-4 sm:px-6 mb-20 sm:mb-28">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white mb-3 sm:mb-4 px-2">The completely unfair advantage.</h2>
          <p className="text-white/40 max-w-lg mx-auto text-sm sm:text-base px-4">Every card below shows the exact intelligence happening inside the platform — not stock art.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

          {/* ── Card 1: RAG — hero card, col-span-2 ── */}
          <div className="lg:col-span-2 rounded-[1.5rem] sm:rounded-[2rem] border border-white/8 bg-white/[0.025] p-5 sm:p-9 flex flex-col gap-6 sm:gap-7 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent pointer-events-none"/>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <RAGIcon className="w-6 h-6 sm:w-7 sm:h-7"/>
              </div>
              <div className="relative z-10 w-full">
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Feature #1 · The Core Differentiator</div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">RAG-Powered Web Research</h3>
                <p className="text-xs sm:text-sm text-white/45 mt-2 leading-relaxed max-w-xl">
                  Toggle <span className="text-white/70 font-semibold">"Enhance with Web Research"</span> and the system fires Google Custom Search, pulls top sources, runs FAISS vector embeddings to rank relevance, and weaves cited facts directly into your content. Zero hallucinations.
                </p>
              </div>
            </div>
            <div className="relative z-10 mt-auto">
              <RAGMockup/>
            </div>
          </div>

          {/* ── Card 2: Context — col-span-1 ── */}
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-white/8 bg-white/[0.025] p-5 sm:p-7 flex flex-col gap-5 sm:gap-6 relative overflow-hidden hover:border-purple-500/30 transition-colors min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 to-transparent pointer-events-none"/>
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <ContextIcon className="w-5 h-5 sm:w-6 sm:h-6"/>
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-1">Feature #2</div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">Full Document Context</h3>
                <p className="text-[11px] sm:text-xs text-white/40 mt-1.5 leading-relaxed">
                  Every section knows the entire document — adjacent section summaries, word count targets, and outline position. Section 5 knows what Section 4 said.
                </p>
              </div>
            </div>
            <div className="relative z-10 mt-auto h-full grid">
              <ContextMockup/>
            </div>
          </div>

          {/* ── Card 3: Refinement — col-span-1 ── */}
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-white/8 bg-white/[0.025] p-5 sm:p-7 flex flex-col gap-5 sm:gap-6 relative overflow-hidden hover:border-green-500/30 transition-colors min-h-[400px]">
             <div className="absolute inset-0 bg-gradient-to-tr from-green-500/8 to-transparent pointer-events-none"/>
             <div className="flex items-start gap-3 relative z-10">
               <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                 <RefineIcon className="w-5 h-5 sm:w-6 sm:h-6"/>
               </div>
               <div>
                 <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-green-400 mb-1">Feature #3</div>
                 <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">NLP Refinement</h3>
                 <p className="text-[11px] sm:text-xs text-white/40 mt-1.5 leading-relaxed">
                   Type instructions like <span className="text-white/60 italic">"make this concise"</span>. The AI accesses past preference history and auto-adjusts word counts based on context.
                 </p>
               </div>
             </div>
             <div className="relative z-10 mt-auto h-full grid">
               <RefineMockup/>
             </div>
          </div>

          {/* ── Card 4: Outline — col-span-1 ── */}
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-white/8 bg-white/[0.025] p-5 sm:p-7 flex flex-col gap-5 sm:gap-6 relative overflow-hidden hover:border-indigo-500/30 transition-colors min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-bl from-indigo-500/8 to-transparent pointer-events-none"/>
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <LayoutTemplate className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400"/>
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Feature #4</div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">AI Generated Outlines</h3>
                <p className="text-[11px] sm:text-xs text-white/40 mt-1.5 leading-relaxed">
                  Enter a topic and generate structured 5–8 section outlines completely aware of DOCX vs PPTX output target lengths.
                </p>
              </div>
            </div>
            <div className="relative z-10 mt-auto h-full grid">
              <OutlineMockup/>
            </div>
          </div>

          {/* ── Card 5: Export — col-span-1 ── */}
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-white/8 bg-white/[0.025] p-5 sm:p-7 flex flex-col gap-5 sm:gap-6 relative overflow-hidden hover:border-orange-500/30 transition-colors min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/8 to-transparent pointer-events-none"/>
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <ExportIcon className="w-5 h-5 sm:w-6 sm:h-6"/>
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">Feature #5</div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">Professional Export</h3>
                <p className="text-[11px] sm:text-xs text-white/40 mt-1.5 leading-relaxed">
                  Export robust DOCX files with formatting, or natively generate PowerPoint presentations with 4 unique stylistic themes.
                </p>
              </div>
            </div>
            <div className="relative z-10 mt-auto h-full grid">
              <ExportMockup/>
            </div>
          </div>

          {/* ── Card 6: Comparison ── col-span-3 full-width ── */}
          <div className="lg:col-span-3 rounded-[1.5rem] sm:rounded-[2rem] border border-white/8 bg-white/[0.025] p-5 sm:p-9 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-7 gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">DocBuilder vs. Every Other Tool</h3>
                <p className="text-xs sm:text-sm text-white/35 mt-1">No other AI document builder ships all of these together.</p>
              </div>
              <div className="flex gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-blue-400"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500"/>DocBuilder AI</span>
                <span className="flex items-center gap-1.5 text-white/25"><div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/15"/>Generic AI</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {[
                { label: 'Live Google CSE + FAISS RAG', us: true, tag: 'RAG' },
                { label: 'Full Document Context Sync', us: true, tag: 'Context' },
                { label: 'Refinement Preference Learning', us: true, tag: 'Memory' },
                { label: 'AI-Structured Outlines', us: true, tag: 'Outline' },
                { label: 'Per-Section Word Targets', us: true, tag: 'Precision' },
                { label: 'Drag-and-Drop Reordering', us: true, tag: 'UI' },
                { label: '4 Custom PPTX Themes', us: true, tag: 'Export' },
                { label: 'Auditable URL Citations', us: true, tag: 'Trust' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:py-3 rounded-xl border border-white/8 bg-white/[0.03] hover:border-blue-500/20 transition-colors">
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]"/>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] sm:text-[11px] font-semibold text-white/70 truncate">{f.label}</div>
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-blue-400/70 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/15 shrink-0">{f.tag}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
        <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-white/8 bg-white/[0.03] p-8 sm:p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"/>
          <div className="relative z-10 text-center md:text-left w-full md:w-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2 sm:mb-3">Stop writing from scratch.</h2>
            <p className="text-white/40 text-sm sm:text-base md:text-lg max-w-lg mx-auto md:mx-0">Your next document deserves real research, real structure, and real intelligence — not just a prompt box.</p>
          </div>
          <div className="relative z-10 flex flex-col items-center md:items-end gap-3 w-full md:w-auto shrink-0">
            <Link href="/register" className="w-full md:w-auto">
              <button className="w-full bg-white text-black font-black px-8 sm:px-12 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl hover:scale-[1.03] transition-transform shadow-[0_0_50px_-15px_rgba(255,255,255,0.25)] text-sm sm:text-base">
                Get Started Free
              </button>
            </Link>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-white/25 tracking-widest">No Credit Card · Full Access</span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="container mx-auto px-4 sm:px-6 pt-6 pb-10 sm:pb-12 border-t border-white/6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-white/25 text-center md:text-left">
          <div className="flex items-center gap-2 font-semibold text-white/50">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0"/>DocBuilder AI · © {new Date().getFullYear()}
          </div>
          <div className="flex gap-4 sm:gap-6 font-semibold tracking-wide">
            <Link href="#" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white/60 transition-colors">Terms</Link>
          </div>
          <div className="font-bold uppercase tracking-widest text-white/20">Created by SAMBIT PRADHAN 22BCB0139</div>
        </div>
      </footer>
    </div>
  );
}

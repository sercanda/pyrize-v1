
import React, { useState } from 'react';
import Plasma from './Plasma';
import { 
  Copy, 
  Check, 
  Terminal, 
  Code2, 
  ChevronRight, 
  Sparkles,
  Zap
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');

  const installCommands = {
    pnpm: 'pnpm add ogl',
    npm: 'npm install ogl',
    yarn: 'yarn add ogl',
    bun: 'bun add ogl'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommands[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#0b1528] text-white flex flex-col overflow-hidden">
      {/* Background Plasma - Using Azure/Cyan for better harmony with deep navy */}
      <div className="absolute inset-0 z-0">
        <Plasma 
          color="#00f2ff"
          speed={0.35}
          direction="forward"
          scale={1.3}
          opacity={0.7}
          mouseInteractive={true}
        />
        {/* Subtle radial overlay for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0b1528_100%)] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1528]/80 via-transparent to-[#0e1527]" />
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 max-w-5xl mx-auto w-full text-center space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest animate-pulse backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 fill-cyan-400/20" />
            High Fidelity Visuals
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none drop-shadow-2xl">
            Saphire <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
              Fluidity.
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Experience organic fluid dynamics powered by advanced WebGL 300es shaders. 
            Seamless integration for high-performance React applications.
          </p>
        </div>

        {/* Installation Section */}
        <div className="w-full max-w-md mx-auto space-y-4">
          <div className="flex gap-2 p-1.5 bg-[#0e1527]/80 backdrop-blur-xl rounded-2xl border border-white/5 w-full">
            {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === tab ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="group relative">
            <div className="bg-[#0e1527]/40 backdrop-blur-2xl border border-cyan-500/10 p-5 rounded-2xl flex items-center justify-between font-mono text-sm hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-cyan-500" />
                <span className="text-slate-300 font-medium">{installCommands[activeTab]}</span>
              </div>
              <button 
                onClick={handleCopy}
                className="p-2 hover:bg-cyan-500/10 rounded-xl transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Code Snippet Card */}
        <div className="w-full bg-[#0e1527]/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Component API</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-800" />
              <div className="w-3 h-3 rounded-full bg-slate-800" />
              <div className="w-3 h-3 rounded-full bg-slate-800" />
            </div>
          </div>
          <div className="p-10 text-left font-mono text-sm md:text-base overflow-x-auto custom-scrollbar">
            <pre className="text-slate-300 leading-relaxed">
              <code>
{`import Plasma from './Plasma';

function Hero() {
  return (
    <div className="relative w-full h-[600px] bg-[#0b1528]">
      <Plasma 
        color="#00f2ff"
        speed={0.5}
        direction="forward"
        scale={1.2}
        opacity={0.7}
        mouseInteractive={true}
      />
      {/* Content overlays */}
    </div>
  );
}`}
              </code>
            </pre>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center gap-8 justify-center">
          <button className="group relative flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold hover:bg-cyan-50 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]">
            Start Building <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors text-sm font-semibold tracking-wide group">
            Documentation 
            <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </main>

      <footer className="relative z-10 py-12 px-6 text-center border-t border-white/5 bg-[#0e1527]/40 backdrop-blur-md">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6 text-xs text-slate-500 font-bold uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-cyan-400 transition-colors">Github</a>
            <span className="text-slate-800">•</span>
            <a href="#" className="hover:text-cyan-400 transition-colors">Examples</a>
            <span className="text-slate-800">•</span>
            <a href="#" className="hover:text-cyan-400 transition-colors">License</a>
          </div>
          <p className="text-slate-600 text-[10px] font-medium tracking-widest">
            ENGINEERED WITH PRECISION • POWERED BY OGL & WEBGL 2
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

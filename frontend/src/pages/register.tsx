import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Loader2, Mail, Lock, ArrowLeft, User, Brain, Search, Wand2, Download, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const LogoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="logoGradReg" x1="0" y1="0" x2="40" y2="40">
        <stop stopColor="#A855F7" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="24" height="24" rx="6" fill="url(#logoGradReg)" fillOpacity="0.15" stroke="url(#logoGradReg)" strokeWidth="2" />
    <path d="M16 14H24M16 20H24M16 26H20" stroke="url(#logoGradReg)" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="26" cy="26" r="4" fill="#3B82F6" />
    <path d="M26 24V28M24 26H28" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function Register() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!displayName.trim()) {
      setError("Display name is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: displayName.trim()
      });

      const token = await userCredential.user.getIdToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/save-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      router.push('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please use a different email or login.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Search,
      title: "Real-Time Web Research",
      desc: "RAG system fetches current, cited data from the web to enhance your content without hallucination."
    },
    {
      icon: Wand2,
      title: "Context-Aware Refinement",
      desc: "AI understands your entire document structure for smart, contextual improvements automatically."
    },
    {
      icon: Download,
      title: "Professional Export",
      desc: "Generate and export to DOCX or PPTX with custom premium themes and perfect formatting."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050709] text-white flex flex-col lg:flex-row relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Left Side - Storytelling */}
      <div className="hidden lg:flex flex-col w-[45%] relative p-16 border-r border-white/6 overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col h-full max-w-lg mx-auto w-full">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10 hover:opacity-80 transition-opacity self-start">
            <LogoIcon className="h-7 w-7" />
            <span className="text-xl font-bold tracking-tight text-white">DocBuilder AI</span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-6 w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shrink-0" />
              Join the future
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black mb-4 sm:mb-6 tracking-tighter leading-[1.1] text-white">
              Create documents <br className="hidden sm:block" />
              <span className="bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">that think.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/40 leading-relaxed mb-8 sm:mb-10">
              Join professionals using advanced AI and live RAG pipelines to create better research 10x faster.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:space-y-4">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs sm:text-[13px] mb-1">{feature.title}</h3>
                    <p className="text-[10px] sm:text-[11px] text-white/40 leading-relaxed hidden sm:block">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="relative z-10 flex items-center justify-between mt-10 pt-6 border-t border-white/5 w-full">
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/20">
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
              <span>Forever Free</span>
            </div>
            <div className="flex gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#050709] bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs -ml-2 first:ml-0 z-30"><Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#050709] bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs -ml-4 z-20"><Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#050709] bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs -ml-4 z-10"><Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-4 sm:p-12 relative z-10 overflow-y-auto custom-scrollbar h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto relative my-auto py-8 lg:py-0"
        >
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <Link href="/" className="inline-flex items-center text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors group">
              <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform" />
              Return Home
            </Link>

            <Link href="/" className="lg:hidden flex items-center gap-2 hover:opacity-80 transition-opacity">
              <LogoIcon className="h-5 w-5" />
              <span className="text-sm font-bold tracking-tight text-white">DocBuilder AI</span>
            </Link>
          </div>

          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 bg-[#0d1117]/80 backdrop-blur-xl shadow-2xl p-6 sm:p-10 relative overflow-hidden mb-8 lg:mb-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">Create account</h1>
              <p className="text-xs sm:text-sm text-white/40 mb-8">
                Start building beautiful, intelligent documents in seconds.
              </p>

              <form onSubmit={handleRegister} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 text-xs font-medium text-red-400 bg-red-400/10 rounded-xl border border-red-400/20 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <div className="space-y-4 sm:space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/50 ml-1">
                      Display Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 pl-11 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/[0.02] transition-colors text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/50 ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 pl-11 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/[0.02] transition-colors text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/50 ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="password"
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 pl-11 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/[0.02] transition-colors text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/50 ml-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <input
                        type="password"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 pl-11 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/[0.02] transition-colors text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-black text-xs sm:text-sm px-8 py-3.5 sm:py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:hover:scale-100 group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <LogoIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
                
                <p className="text-[9px] sm:text-[10px] text-white/30 text-center font-medium leading-relaxed mt-4">
                  By joining, you agree to our Terms of Service and Privacy Policy. No credit card required.
                </p>
              </form>

              <div className="mt-6 sm:mt-8 text-center text-[11px] sm:text-[12px] font-medium text-white/40">
                Already have an account?{' '}
                <Link href="/login" className="text-white hover:text-purple-400 transition-colors underline decoration-white/20 underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import React from 'react';
import { RefreshCw, AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-6 font-sans select-none">
          <div className="max-w-md w-full bg-[#121212] border border-white/10 rounded-3xl p-7 shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#ebd73f]/10 border border-[#ebd73f]/30 flex items-center justify-center mx-auto text-[#ebd73f]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 text-[#ebd73f] border border-white/10">
                Application Recovery
              </span>
              <h2 className="text-2xl font-bold font-panchang tracking-tight text-white">
                Something went wrong
              </h2>
              <p className="text-xs text-slate-300 font-clash leading-relaxed">
                An unexpected view error occurred while loading this page. You can reload or reset to the main catalogue below.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-[#ebd73f] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#ffe600] transition cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs tracking-wider flex items-center justify-center gap-2 border border-white/10 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-400" />
                <span>Reset Cache & Return to Home</span>
              </button>
            </div>

            {this.state.error && (
              <details className="text-left bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] font-mono text-slate-400">
                <summary className="cursor-pointer text-slate-500 hover:text-slate-300">
                  Diagnostic Information
                </summary>
                <p className="mt-2 text-rose-400 font-bold break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-1 text-[9px] text-slate-500 overflow-x-auto max-h-32">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

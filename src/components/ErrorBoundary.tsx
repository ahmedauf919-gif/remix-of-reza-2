import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; label?: string; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 bg-[#f0f4f8]">
          <div className="max-w-xl w-full rounded-xl border border-red-200 bg-white p-6 shadow">
            <h2 className="text-lg font-bold text-red-700 mb-2">
              {this.props.label ?? "Module"} failed to load
            </h2>
            <p className="text-sm text-red-600 font-mono bg-red-50 rounded p-3 break-all">
              {this.state.error.message}
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Check the browser console (F12) for the full stack trace.
            </p>
            <button
              className="mt-4 text-sm text-[#005298] underline"
              onClick={() => this.setState({ error: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

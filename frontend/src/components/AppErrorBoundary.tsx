import React from 'react';

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Frontend render error:', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-5 font-sans">
        <section className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <i className="fa-solid fa-triangle-exclamation text-2xl" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Page load nahi ho paaya</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Screen ko safely recover karne ke liye page reload karein. Agar issue repeat ho, browser console me error detail available hogi.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#18327b] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#12245a]"
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
            Reload Page
          </button>
        </section>
      </main>
    );
  }
}

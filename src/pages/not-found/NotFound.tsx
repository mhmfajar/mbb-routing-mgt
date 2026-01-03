import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-pink-500 leading-none">
            404
          </h1>
          <div className="absolute inset-0 text-[150px] font-bold text-primary/10 blur-2xl leading-none">
            404
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-white mb-8">Page Not Found</h2>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover rounded-xl px-6 py-3 text-sm font-medium text-white transition-all"
          >
            <span>🏠</span>
            <span>Back to Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-background-secondary hover:bg-background border border-white/10 rounded-xl px-6 py-3 text-sm font-medium text-white transition-all"
          >
            <span>←</span>
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import { AlertTriangle } from 'lucide-react';

const ErrorState = ({ message = 'Unable to load this view.', onRetry }) => (
  <div className="panel flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
    <AlertTriangle className="mb-4 text-coral" size={42} />
    <h2 className="text-xl font-bold text-ink">Something went wrong</h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-ink/65">{message}</p>
    {onRetry ? (
      <button type="button" onClick={onRetry} className="btn-primary mt-5">
        Try Again
      </button>
    ) : null}
  </div>
);

export default ErrorState;

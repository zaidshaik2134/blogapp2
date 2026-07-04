const Spinner = ({ label = 'Loading...' }) => (
  <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-ink/70">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink/10 border-t-ocean" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);

export default Spinner;

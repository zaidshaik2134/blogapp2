import { FileText } from 'lucide-react';

const EmptyState = ({ title = 'No blogs yet', message = 'Create the first post to get started.' }) => (
  <div className="panel flex min-h-72 flex-col items-center justify-center px-6 py-10 text-center">
    <FileText className="mb-4 text-ocean" size={42} />
    <h2 className="text-xl font-bold text-ink">{title}</h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-ink/65">{message}</p>
  </div>
);

export default EmptyState;

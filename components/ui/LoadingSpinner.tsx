interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={className}>
      <div className="animate-spin w-8 h-8 border-4 border-accent-light border-t-accent rounded-full" />
    </div>
  );
}
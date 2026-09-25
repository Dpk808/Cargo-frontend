interface FormMessageProps {
  message?: string;
}

export function FormMessage({ message }: FormMessageProps) {
  if (!message) return null;
  return <p className="text-xs text-red-500">{message}</p>;
}
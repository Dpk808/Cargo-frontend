interface FormItemProps {
  children: React.ReactNode;
  className?: string;
}

export function FormItem({ children, className = "" }: FormItemProps) {
  return <div className={`flex flex-col gap-1.5 ${className}`}>{children}</div>;
}
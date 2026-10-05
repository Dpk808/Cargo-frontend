import type { PropsWithChildren } from 'react';

interface FormSectionProps {
	title: string;
	description?: string;
	columns?: number;
	className?: string;
}

export default function FormSection({
	title,
	description,
	columns = 2,
	className = '',
	children,
}: PropsWithChildren<FormSectionProps>) {
	return (
		<fieldset className={`rounded-lg border border-[var(--color-mist)]/50 bg-[var(--color-canvas)]/30 p-5 ${className}`}>
			<legend className="px-2 text-sm font-semibold text-[var(--color-ocean)]">
				{title}
			</legend>
			{description && (
				<p className="mb-4 px-2 text-xs text-[var(--color-ink)]/60">{description}</p>
			)}
			<div className={`grid gap-4 md:grid-cols-${columns}`}>
				{children}
			</div>
		</fieldset>
	);
}

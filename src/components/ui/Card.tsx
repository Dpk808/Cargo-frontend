import type { PropsWithChildren } from 'react';

interface CardProps {
	title?: string;
	subtitle?: string;
	className?: string;
	action?: React.ReactNode;
}

export default function Card({
	title,
	subtitle,
	action,
	className = '',
	children,
}: PropsWithChildren<CardProps>) {
	return (
		<section
			className={`rounded-xl border border-white/70 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md ${className}`}
		>
			{(title || subtitle || action) && (
				<header className="mb-6 flex items-start justify-between gap-4">
					<div>
						{title && <h3 className="text-xl font-bold text-[var(--color-ink)]">{title}</h3>}
						{subtitle && <p className="mt-1 text-sm text-[var(--color-ink)]/70">{subtitle}</p>}
					</div>
					{action}
				</header>
			)}
			{children}
		</section>
	);
}

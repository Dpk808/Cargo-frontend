import type { InputHTMLAttributes } from 'react';

interface InputBoxProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	hint?: string;
	half?: boolean;
}

export default function InputBox({
	label,
	id,
	className = '',
	error,
	hint,
	half = false,
	...props
}: InputBoxProps) {
	return (
		<label className={`flex flex-col gap-2 ${half ? 'w-1/2' : 'w-full'}`}>
			<div className="flex items-center justify-between">
				<span className="text-sm font-semibold text-[var(--color-ink)]">
					{label}
				</span>
				{hint && <span className="text-xs text-[var(--color-ink)]/60">{hint}</span>}
			</div>
			<input
				id={id}
				className={`w-full h-11 rounded-lg border border-[var(--color-mist)] bg-white px-4 py-2.5 text-sm text-[var(--color-ink)] placeholder-[var(--color-ink)]/40 outline-none transition-all duration-200 hover:border-[var(--color-ocean)]/40 focus:border-[var(--color-ocean)] focus:ring-2 focus:ring-[var(--color-ocean)]/15 disabled:bg-[var(--color-canvas)] disabled:text-[var(--color-ink)]/50 ${className}`}
				{...props}
			/>
			{error && <span className="text-xs font-medium text-red-600">{error}</span>}
		</label>
	);
}

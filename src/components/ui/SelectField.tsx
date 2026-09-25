import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
	label: string;
	value: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label: string;
	options: SelectOption[];
	placeholder?: string;
}

export default function SelectField({
	label,
	options = [],
	placeholder,
	className = '',
	...props
}: SelectFieldProps) {
	return (
		<label className="flex w-full flex-col gap-2">
			<span className="text-sm font-semibold text-[var(--color-ink)]">
				{label}
			</span>
			<select
				className={`h-11 rounded-lg border border-[var(--color-mist)] bg-white px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition-all duration-200 hover:border-[var(--color-ocean)]/40 focus:border-[var(--color-ocean)] focus:ring-2 focus:ring-[var(--color-ocean)]/15 disabled:bg-[var(--color-canvas)] disabled:text-[var(--color-ink)]/50 ${className}`}
				{...props}
			>
				{placeholder && <option value="">{placeholder}</option>}
				{options?.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</label>
	);
}

'use client';

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning' | 'info';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	isLoading?: boolean;
	fullWidth?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
	primary:
		'bg-[var(--color-ocean)] text-white hover:bg-[#335f94] active:bg-[#2d5282] focus-visible:ring-[var(--color-ocean)]',
	secondary:
		'bg-[var(--color-mist)] text-[var(--color-ink)] hover:bg-[#b8c8e0] active:bg-[#a8b8d0] focus-visible:ring-[var(--color-ocean)]',
	ghost:
		'bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-canvas)] active:bg-[var(--color-mist)] focus-visible:ring-[var(--color-ocean)]',
	danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500',
	warning: 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 focus-visible:ring-yellow-500',
	info: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500',
};

const sizeClass: Record<ButtonSize, string> = {
	sm: 'h-10 px-3 text-sm',
	md: 'h-11 px-4 text-sm font-medium',
	lg: 'h-12 px-6 text-base font-medium',
};

export default function Button({
	children,
	variant = 'primary',
	size = 'md',
	isLoading = false,
	fullWidth = false,
	className = '',
	disabled,
	...props
}: PropsWithChildren<ButtonProps>) {
	return (
		<button
			type="button"
			className={`inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass[size]} ${variantClass[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
			disabled={disabled || isLoading}
			{...props}
		>
			{isLoading ? 'Please wait...' : children}
		</button>
	);
}

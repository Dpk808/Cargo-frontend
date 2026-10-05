'use client';

import { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import Button from './Button';

interface ModalProps {
	isOpen: boolean;
	title: string;
	onClose: () => void;
}

export default function Modal({
	isOpen,
	title,
	onClose,
	children,
}: PropsWithChildren<ModalProps>) {
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		window.addEventListener('keydown', handleEsc);
		return () => window.removeEventListener('keydown', handleEsc);
	}, [isOpen, onClose]);

	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-[var(--color-ink)]/50 p-4 backdrop-blur-md">
			<div className="w-full max-w-2xl max-h-[90vh] rounded-lg border border-white/70 bg-white shadow-2xl overflow-auto">
				<div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[var(--color-mist)] bg-white px-6 py-4">
					<h3 className="text-lg font-bold text-[var(--color-ink)]">{title}</h3>
					<button
						type="button"
						className="text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] text-xl leading-none"
						onClick={onClose}
					>
						✕
					</button>
				</div>
				<div className="p-6">
					{children}
				</div>
			</div>
		</div>
	);
}

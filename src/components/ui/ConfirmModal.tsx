'use client';

import { AlertTriangle, Info, Trash2, HelpCircle } from 'lucide-react';
import Button from '@/src/components/ui/Button';
import Modal from '@/src/components/ui/Modal';

type ConfirmVariant = 'danger' | 'warning' | 'info' | 'primary';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: React.ReactNode;

  // Used for automatic delete confirmation message
  itemName?: string;

  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const variantConfig: Record<
  ConfirmVariant,
  {
    icon: React.ReactNode;
    bg: string;
    border: string;
    text: string;
    defaultTitle: string;
    defaultDescription: string;
  }
> = {
  danger: {
    icon: <Trash2 size={16} className="text-red-500" />,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    defaultTitle: 'Delete',
    defaultDescription:
      'Are you sure you want to delete this? This action cannot be undone.',
  },
  warning: {
    icon: <AlertTriangle size={16} className="text-yellow-500" />,
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-900',
    defaultTitle: 'Warning',
    defaultDescription:
      'Are you sure you want to proceed? This may have unintended consequences.',
  },
  info: {
    icon: <Info size={16} className="text-blue-500" />,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    defaultTitle: 'Confirm',
    defaultDescription: 'Are you sure you want to proceed?',
  },
  primary: {
    icon: <HelpCircle
      size={16}
      className="text-[var(--color-ocean)]"
    />,
    bg: 'bg-[var(--color-canvas)]',
    border: 'border-[var(--color-mist)]',
    text: 'text-[var(--color-ink)]',
    defaultTitle: 'Confirm',
    defaultDescription: 'Are you sure you want to proceed?',
  },
};

export default function ConfirmModal({
  isOpen,
  title,
  description,
  itemName,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const config = variantConfig[variant];

  const finalDescription =
    description ??
    (variant === 'danger' && itemName ? (
      <>
        Are you sure you want to delete{' '}
        <strong>{itemName}</strong>? This action cannot be undone.
      </>
    ) : (
      config.defaultDescription
    ));

  return (
    <Modal
      isOpen={isOpen}
      title={title ?? config.defaultTitle}
      onClose={onClose}
    >
      <div className="space-y-5">
        <div
          className={`flex items-start gap-3 rounded-lg border ${config.border} ${config.bg} p-4`}
        >
          <span className="mt-0.5 shrink-0">
            {config.icon}
          </span>

          <p className={`text-sm ${config.text}`}>
            {finalDescription}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>

          <Button
            variant={variant}
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

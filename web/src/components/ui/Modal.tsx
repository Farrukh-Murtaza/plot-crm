import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { Card } from './Card';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
    className?: string;
    showCloseButton?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full',
};

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    maxWidth = 'md',
    className = '',
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        if (!closeOnEscape) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, closeOnEscape]);

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <Card
                className={`
                    w-full ${maxWidthClasses[maxWidth]}
                    max-h-[90vh]
                    flex flex-col
                    relative overflow-hidden p-0
                    ${className}
                `}
            >
                {/* Header - stays pinned */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                        {title ? (
                            <h2 id="modal-title" className="text-2xl font-bold text-foreground">
                                {title}
                            </h2>
                        ) : (
                            <span />
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={20} className="text-muted-foreground" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content - the only part that scrolls */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {children}
                </div>

                {/* Footer - stays pinned */}
                {footer && (
                    <div className="px-6 py-4 border-t border-border shrink-0">
                        {footer}
                    </div>
                )}
            </Card>
        </div>,
        document.body
    );
};

Modal.displayName = 'Modal';
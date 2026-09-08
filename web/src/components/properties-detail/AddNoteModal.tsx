import React, { useState } from 'react';
import { X, Plus, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (content: string) => void;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
    isOpen,
    onClose,
    onSave
}) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            onSave(content);
            setContent('');
            onClose();
        } catch (error) {
            console.error('Error adding note:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                    <X size={20} className="text-muted-foreground" />
                </button>

                <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6 flex items-center gap-2">
                    <FileText size={24} className="text-primary" />
                    Add Note
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-white mb-1">
                            Note Content *
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={6}
                            placeholder="Enter your note here..."
                            className="w-full px-3 py-2 bg-surface dark:bg-surface-elevated border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                            required
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                            {content.length} characters
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                            disabled={!content.trim()}
                            className="flex-1"
                        >
                            <Plus size={18} className="mr-2" />
                            Add Note
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
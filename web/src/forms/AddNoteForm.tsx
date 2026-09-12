import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui';

interface AddNoteFormProps {
    onSave: (content: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const AddNoteForm: React.FC<AddNoteFormProps> = ({
    onSave,
    onCancel,
    isLoading = false,
}) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onSave(content);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <Textarea
                label='Note Content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Enter your note here..."
                required
            />


            <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    loading={isLoading}
                    disabled={!content.trim()}
                    className="flex-1"
                >
                    <Plus size={18} className="mr-2" />
                    Add Note
                </Button>
            </div>
        </form>
    );
};
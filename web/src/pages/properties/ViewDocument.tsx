import React, { useState } from 'react';
import { X, Download, Eye, File, ExternalLink, FileImage, FileText, FileArchive } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface Document {
    name: string;
    type: string;
    uploadedAt: string;
    url: string;
}

interface ViewDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    document: Document | null;
}

export const ViewDocumentModal: React.FC<ViewDocumentModalProps> = ({
    isOpen,
    onClose,
    document
}) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen || !document) return null;

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FileText size={48} className="text-danger" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FileImage size={48} className="text-primary" />;
            case 'zip':
            case 'rar':
            case '7z':
                return <FileArchive size={48} className="text-warning" />;
            default:
                return <File size={48} className="text-muted-foreground" />;
        }
    };

    const handleDownload = () => {
        setLoading(true);
        // Simulate download
        setTimeout(() => {
            setLoading(false);
            // In real app: window.open(document.url, '_blank') or download via API
            alert(`Downloading: ${document.name}`);
        }, 1000);
    };

    const handleView = () => {
        // In real app: open in new tab or inline viewer
        window.open(document.url, '_blank');
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

                <div className="text-center">
                    <div className="mb-4 flex justify-center">
                        {getFileIcon(document.name)}
                    </div>

                    <h2 className="text-xl font-bold text-foreground  mb-2">
                        {document.name}
                    </h2>

                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p>
                            <span className="font-medium">Type:</span> {document.type}
                        </p>
                        <p>
                            <span className="font-medium">Uploaded:</span>{' '}
                            {new Date(document.uploadedAt).toLocaleDateString('en-PK', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                        <Button
                            onClick={handleView}
                            className="flex-1"
                        >
                            <Eye size={18} className="mr-2" />
                            View
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleDownload}
                            loading={loading}
                            className="flex-1"
                        >
                            <Download size={18} className="mr-2" />
                            Download
                        </Button>
                    </div>

                    <button
                        onClick={handleView}
                        className="mt-3 text-sm text-primary hover:text-primary-hover transition-colors flex items-center justify-center gap-1"
                    >
                        <ExternalLink size={14} />
                        Open in new tab
                    </button>
                </div>
            </Card>
        </div>
    );
};
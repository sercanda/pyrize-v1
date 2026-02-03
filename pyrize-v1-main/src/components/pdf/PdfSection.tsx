/**
 * PdfSection Component
 * 
 * A section wrapper for PDF content that prevents page breaks within.
 * Use for cards, info blocks, and grouped content.
 */
import React from 'react';

interface PdfSectionProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    /** If true, this section can be condensed when page overflows */
    condensable?: boolean;
}

export default function PdfSection({
    children,
    title,
    className = '',
    condensable = true
}: PdfSectionProps) {
    return (
        <div
            className={`pdf-section ${condensable ? 'pdf-condensable' : ''} ${className}`}
            data-pdf-condensable={condensable}
        >
            {title && (
                <h3 className="pdf-section-title">{title}</h3>
            )}
            <div className="pdf-section-content">
                {children}
            </div>
        </div>
    );
}

/**
 * PdfCard Component
 * 
 * A card that never splits across pages.
 */
interface PdfCardProps {
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    title?: string;
}

export function PdfCard({
    children,
    className = '',
    icon,
    title
}: PdfCardProps) {
    return (
        <div className={`pdf-card ${className}`}>
            {(icon || title) && (
                <div className="pdf-card-header">
                    {icon && <span className="pdf-card-icon">{icon}</span>}
                    {title && <h4 className="pdf-card-title">{title}</h4>}
                </div>
            )}
            <div className="pdf-card-content">
                {children}
            </div>
        </div>
    );
}

/**
 * PdfGrid Component
 * 
 * A responsive grid for cards that adjusts columns based on condensed state.
 */
interface PdfGridProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3;
    className?: string;
}

export function PdfGrid({
    children,
    columns = 2,
    className = ''
}: PdfGridProps) {
    const colClass = columns === 3 ? 'pdf-grid-3' : columns === 2 ? 'pdf-grid-2' : 'pdf-grid-1';
    return (
        <div className={`pdf-grid ${colClass} ${className}`}>
            {children}
        </div>
    );
}

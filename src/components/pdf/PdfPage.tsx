/**
 * PdfPage Component
 * 
 * A single A4 page wrapper for PDF rendering.
 * - Fixed dimensions: 210mm × 297mm
 * - Safe margins: 10mm all sides
 * - Overflow hidden to prevent content bleeding
 */
import React from 'react';

interface PdfPageProps {
    children: React.ReactNode;
    pageNumber?: number;
    totalPages?: number;
    showPageNumber?: boolean;
    condensed?: boolean;
    className?: string;
}

export default function PdfPage({
    children,
    pageNumber,
    totalPages,
    showPageNumber = false,
    condensed = false,
    className = ''
}: PdfPageProps) {
    return (
        <div
            className={`pdf-page ${condensed ? 'pdf-condensed' : ''} ${className}`}
            data-page-number={pageNumber}
        >
            <div className="pdf-page-content">
                {children}
            </div>

            {showPageNumber && pageNumber && totalPages && (
                <div className="pdf-page-footer">
                    <span className="pdf-page-number">
                        {pageNumber} / {totalPages}
                    </span>
                </div>
            )}
        </div>
    );
}

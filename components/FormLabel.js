
import React from 'react';

interface FormLabelProps {
    htmlFor?: string;
    children: React.ReactNode;
    className?: string;
}

const FormLabel: React.FC<FormLabelProps> = ({ htmlFor, children, className }) => (
    <label htmlFor={htmlFor} className={`block text-xs text-muted mb-1 mt-3 ${className}`}>
        {children}
    </label>
);

export default FormLabel;
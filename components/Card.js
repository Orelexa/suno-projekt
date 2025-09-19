
import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
    return (
        <section className={`bg-panel border border-line rounded-xl p-4 h-full ${className}`}>
            <h2 className="text-sm font-semibold mb-3 text-indigo-light tracking-wide">{title}</h2>
            {children}
        </section>
    );
};

export default Card;
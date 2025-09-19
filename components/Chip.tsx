
import React from 'react';

interface ChipProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, isActive, onClick }) => {
    const baseClasses = "text-xs cursor-pointer user-select-none rounded-full px-3 py-1.5 border transition-all duration-200";
    const activeClasses = "bg-accent/10 border-accent text-accent font-semibold";
    const inactiveClasses = "bg-bg-dark/50 border-line hover:border-slate-600 text-slate-300";

    return (
        <div onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {label}
        </div>
    );
};

export default Chip;

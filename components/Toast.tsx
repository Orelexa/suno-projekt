
import React, { useState, useEffect } from 'react';

interface ToastProps {
    message: string | null;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 2800);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div
            className={`fixed bottom-5 right-5 bg-panel border border-accent/50 text-text-main px-6 py-3 rounded-lg shadow-2xl transition-all duration-300 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ pointerEvents: visible ? 'auto' : 'none' }}
        >
            {message}
        </div>
    );
};

export default Toast;

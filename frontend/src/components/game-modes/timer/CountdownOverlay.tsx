import React, { useEffect, useState } from 'react';

interface CountdownOverlayProps {
    onComplete: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
    const [count, setCount] = useState<number | 'GO!'>(3);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (count === 3) {
            const timer = setTimeout(() => setCount(2), 1000);
            return () => clearTimeout(timer);
        } else if (count === 2) {
            const timer = setTimeout(() => setCount(1), 1000);
            return () => clearTimeout(timer);
        } else if (count === 1) {
            const timer = setTimeout(() => setCount('GO!'), 1000);
            return () => clearTimeout(timer);
        } else if (count === 'GO!') {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onComplete();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [count, onComplete]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div
                className={`
          text-white font-bold text-center
          ${count === 'GO!' ? 'animate-scale-up text-8xl sm:text-9xl' : 'animate-pulse-scale text-9xl sm:text-[12rem]'}
        `}
                style={{
                    textShadow: '0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.3)',
                }}
            >
                {count}
            </div>
        </div>
    );
};

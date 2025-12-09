import React, { useEffect, useState } from 'react';

interface TimerProps {
    timeLimit: number; // in seconds
    isRunning: boolean;
    onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({ timeLimit, isRunning, onTimeUp }) => {
    const [timeRemaining, setTimeRemaining] = useState(timeLimit);

    useEffect(() => {
        setTimeRemaining(timeLimit);
    }, [timeLimit]);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, onTimeUp]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getColorClass = (): string => {
        const percentage = (timeRemaining / timeLimit) * 100;
        if (percentage > 50) return 'text-green-400';
        if (percentage > 20) return 'text-yellow-400';
        return 'text-red-500 animate-pulse';
    };

    return (
        <div className="flex items-center gap-2">
            <svg
                className={`w-6 h-6 ${getColorClass()}`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className={`text-2xl font-mono font-bold ${getColorClass()}`}>
                {formatTime(timeRemaining)}
            </span>
        </div>
    );
};

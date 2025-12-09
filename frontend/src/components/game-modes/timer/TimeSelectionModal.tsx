import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TimeSelectionModalProps {
    isOpen: boolean;
    onSelectTime: (seconds: number) => void;
}

const timeOptions = [
    { label: '10 seconds', value: 10 },
    { label: '30 seconds', value: 30 },
    { label: '45 seconds', value: 45 },
    { label: '1 minute', value: 60 },
    { label: '3 minutes', value: 180 },
    { label: '5 minutes', value: 300 },
];

export const TimeSelectionModal: React.FC<TimeSelectionModalProps> = ({
    isOpen,
    onSelectTime,
}) => {
    const [selectedTime, setSelectedTime] = React.useState<number | null>(null);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleStart = () => {
        if (selectedTime !== null) {
            onSelectTime(selectedTime);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-medium text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    BACK
                </button>

                <h2 className="text-3xl font-bold text-white mb-3 text-center mt-4">
                    How Fast Are You?
                </h2>
                <p className="text-gray-300 text-center mb-8">
                    Select the time in which you think you&apos;ll guess the word:
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    {timeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setSelectedTime(option.value)}
                            className={`
                py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200
                ${selectedTime === option.value
                                    ? 'bg-green-600 text-white border-2 border-green-400 shadow-lg transform scale-105'
                                    : 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
                                }
              `}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleStart}
                        disabled={selectedTime === null}
                        className={`
            w-full py-4 rounded-lg font-bold text-xl transition-all duration-200
            ${selectedTime === null
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 shadow-lg transform hover:scale-105'
                            }
          `}
                    >
                        START GAME
                    </button>
                </div>
            </div>
        </div>
    );
};

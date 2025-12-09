import React from 'react';

interface TimeSelectionProps {
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

export const TimeSelection: React.FC<TimeSelectionProps> = ({
    onSelectTime,
}) => {
    const [selectedTime, setSelectedTime] = React.useState<number | null>(null);

    const handleStart = () => {
        if (selectedTime !== null) {
            onSelectTime(selectedTime);
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
            <div className="w-full">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 text-center">
                    How Fast Are You?
                </h1>
                <p className="text-gray-300 text-lg sm:text-xl text-center mb-12">
                    Select the time in which you think you&apos;ll guess the word:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
                    {timeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setSelectedTime(option.value)}
                            className={`
                                py-6 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200
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

                <div className="flex justify-center">
                    <button
                        onClick={handleStart}
                        disabled={selectedTime === null}
                        className={`
                            w-full sm:w-auto min-w-[200px] py-4 px-8 rounded-lg font-bold text-xl transition-all duration-200
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


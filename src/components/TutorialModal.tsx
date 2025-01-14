import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const tutorialSteps = [
    {
        title: 'Welcome to Imposter Game!',
        content: 'This tutorial will guide you through the basics of playing the game.',
    },
    {
        title: 'Roles',
        content: 'Players are either regular players or imposters. Imposters don\'t know the secret word.',
    },
    {
        title: 'Gameplay',
        content: 'Regular players try to identify the imposters, while imposters try to blend in.',
    },
    {
        title: 'Winning',
        content: 'Regular players win by identifying all imposters. Imposters win if they remain undetected.',
    },
];

const TutorialModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-3 py-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-lg sm:px-4 sm:py-2 sm:text-base hover:bg-indigo-700"
            >
                How to Play
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl sm:p-8"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{tutorialSteps[currentStep].title}</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 transition-colors hover:text-gray-700"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                            <p className="mb-6 text-sm text-gray-600 sm:text-base">{tutorialSteps[currentStep].content}</p>
                            <div className="flex justify-between gap-4">
                                <button
                                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                    disabled={currentStep === 0}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg sm:px-4 sm:py-2 sm:text-base hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="px-3 py-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-lg sm:px-4 sm:py-2 sm:text-base hover:bg-indigo-700"
                                >
                                    {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TutorialModal;

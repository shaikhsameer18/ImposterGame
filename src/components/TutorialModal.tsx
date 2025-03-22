import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, GhostIcon, UserCheck, UserX } from 'lucide-react';

const tutorialSteps = [
    {
        title: 'Welcome to Imposter Game!',
        content: 'This tutorial will guide you through the basics of playing the game.',
        icon: GhostIcon,
    },
    {
        title: 'Roles',
        content: 'Players are either regular players or imposters. Imposters don\'t know the secret word.',
        icon: UserCheck,
    },
    {
        title: 'Gameplay',
        content: 'Regular players try to identify the imposters, while imposters try to blend in.',
        icon: UserX,
    },
    {
        title: 'Winning',
        content: 'Regular players win by identifying all imposters. Imposters win if they remain undetected.',
        icon: GhostIcon,
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

    const CurrentIcon = tutorialSteps[currentStep].icon;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-3 py-2 text-sm font-medium text-white transition-all bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 rounded-lg flex items-center shadow-lg shadow-primary-900/20"
            >
                <HelpCircle className="w-4 h-4 mr-2" />
                How to Play
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/70 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="w-full max-w-md p-6 bg-surface-800 border border-primary-600/20 rounded-xl shadow-xl sm:p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white sm:text-2xl">{tutorialSteps[currentStep].title}</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full bg-surface-700/50 text-surface-300 transition-colors hover:text-white hover:bg-surface-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="flex items-center mb-5">
                                <div className="p-3 mr-4 bg-primary-900/50 rounded-full">
                                    <CurrentIcon className="w-8 h-8 text-primary-400" />
                                </div>
                                <p className="text-surface-200">{tutorialSteps[currentStep].content}</p>
                            </div>
                            
                            <div className="flex items-center justify-between gap-4 mt-8">
                                <div className="flex items-center space-x-2">
                                    {tutorialSteps.map((_, index) => (
                                        <div 
                                            key={index} 
                                            className={`w-2 h-2 rounded-full ${
                                                index === currentStep 
                                                    ? 'bg-primary-400' 
                                                    : 'bg-surface-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                        disabled={currentStep === 0}
                                        className="px-3 py-2 text-sm font-medium text-surface-200 transition-all bg-surface-700 rounded-lg hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        className="px-3 py-2 text-sm font-medium text-white transition-all bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 rounded-lg"
                                    >
                                        {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TutorialModal;

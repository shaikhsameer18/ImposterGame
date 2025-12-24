import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, GhostIcon, UserCheck, UserX, Sparkles, Target } from 'lucide-react';

const tutorialSteps = [
    {
        title: 'Welcome to Imposter Game!',
        content: 'A thrilling social deduction game where you must find the imposters among you. Pay attention to every detail!',
        icon: Sparkles,
        color: 'from-primary-500 to-accent-500',
    },
    {
        title: 'Player Roles',
        content: 'Players are divided into two groups: Regular players who know the secret word, and Imposters who don\'t know it.',
        icon: UserCheck,
        color: 'from-accent-500 to-secondary-500',
    },
    {
        title: 'The Secret Word',
        content: 'Regular players will see a secret word and category. Imposters won\'t see the word - they must blend in!',
        icon: Target,
        color: 'from-secondary-500 to-primary-500',
    },
    {
        title: 'Gameplay Strategy',
        content: 'Regular players: Ask subtle questions about the word. Imposters: Listen carefully and try to guess the word without revealing yourself!',
        icon: UserX,
        color: 'from-primary-500 to-accent-500',
    },
    {
        title: 'Winning the Game',
        content: 'Regular players win by identifying all imposters. Imposters win if they remain undetected until the end!',
        icon: GhostIcon,
        color: 'from-accent-500 to-secondary-500',
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
            setCurrentStep(0);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const CurrentIcon = tutorialSteps[currentStep].icon;

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base font-semibold text-white transition-all glass-card-hover rounded-xl flex items-center border border-surface-700/50 hover:border-primary-500/50"
            >
                <HelpCircle className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 text-primary-400" />
                How to Play
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="w-full max-w-lg glass-card rounded-2xl p-6 md:p-8 border-2 border-surface-700/50 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${tutorialSteps[currentStep].color} bg-clip-text text-transparent`}>
                                    {tutorialSteps[currentStep].title}
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-xl glass-card-hover text-surface-300 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5 md:w-6 md:h-6" />
                                </motion.button>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col md:flex-row items-center mb-6 md:mb-8">
                                <motion.div
                                    key={currentStep}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className={`p-4 md:p-5 mr-0 md:mr-5 mb-4 md:mb-0 rounded-2xl bg-gradient-to-br ${tutorialSteps[currentStep].color} bg-opacity-20 border border-primary-400/30`}
                                >
                                    <CurrentIcon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                                </motion.div>
                                <motion.p
                                    key={`content-${currentStep}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-surface-200 text-sm md:text-base leading-relaxed text-center md:text-left"
                                >
                                    {tutorialSteps[currentStep].content}
                                </motion.p>
                            </div>

                            {/* Progress Dots */}
                            <div className="flex items-center justify-center space-x-2 mb-6">
                                {tutorialSteps.map((_, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                                                ? 'w-8 bg-gradient-to-r from-primary-400 to-accent-400'
                                                : 'w-2 bg-surface-600'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className="flex-1 px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold text-surface-200 transition-all glass-card-hover rounded-xl disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    Previous
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={nextStep}
                                    className="flex-1 px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold btn-primary"
                                >
                                    {currentStep === tutorialSteps.length - 1 ? 'Get Started!' : 'Next'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TutorialModal;

import { useEffect, useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const InstallPWA = () => {
    const location = useLocation();
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState<any>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            console.log('Before install prompt event');
            setSupportsPWA(true);
            setPromptInstall(e);
        };
        window.addEventListener('beforeinstallprompt', handler);

        // After 3 seconds, animate the button to draw attention
        const timeout = setTimeout(() => {
            setHasInteracted(true);
        }, 3000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            clearTimeout(timeout);
        }
    }, []);

    const onClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        evt.preventDefault();
        setHasInteracted(true);
        if (!promptInstall) {
            console.log('No install prompt available');
            return;
        }
        promptInstall.prompt();
    };

    if (!supportsPWA) {
        console.log('PWA not supported');
        return null;
    }

    // Hide the button when on the game page
    if (location.pathname === '/game') {
        return null;
    }

    return (
        <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{
                y: 0,
                opacity: 1,
                scale: hasInteracted ? [1, 1.05, 1] : 1
            }}
            transition={{
                duration: 0.3,
                scale: {
                    duration: 0.7,
                    repeat: hasInteracted ? 0 : 2,
                    repeatType: "reverse"
                }
            }}
            className="fixed z-50 flex items-center px-4 md:px-5 py-3 md:py-3.5 font-semibold text-white transition-all duration-200 transform rounded-xl shadow-2xl bottom-4 right-4 glass-card border-2 border-primary-500/50 hover:border-primary-400 group"
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                animate={{
                    rotate: [0, 10, -10, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="mr-2 md:mr-3"
            >
                <Download className="w-4 h-4 md:w-5 md:h-5 text-primary-300" />
            </motion.div>
            <span className="text-sm md:text-base">Install App</span>
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 ml-2 text-accent-400 group-hover:rotate-12 transition-transform" />
        </motion.button>
    );
};

export default InstallPWA;

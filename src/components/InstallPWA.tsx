import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

const InstallPWA = () => {
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
            className="fixed z-50 flex items-center px-5 py-3 font-medium text-white transition-all duration-200 transform rounded-lg shadow-lg bottom-4 right-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 shadow-primary-900/30 hover:scale-105"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Download className="w-4 h-4 mr-2" />
            Install App
        </motion.button>
    );
};

export default InstallPWA;

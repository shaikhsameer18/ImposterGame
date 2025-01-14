import React, { useEffect, useState } from 'react';

const InstallPWA: React.FC = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            console.log('Before install prompt event');
            setSupportsPWA(true);
            setPromptInstall(e);
        };
        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const onClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        evt.preventDefault();
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
        <button
            className="fixed z-50 px-4 py-2 mr-4 text-white transition-colors bg-indigo-600 rounded-lg shadow-lg bottom-4 right-4 hover:bg-indigo-700"
            onClick={onClick}
        >
            Install App
        </button>
    );
};

export default InstallPWA;

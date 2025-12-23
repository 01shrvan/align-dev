"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('SW registered:', registration);
                })
                .catch((error) => {
                    console.log('SW registration failed:', error);
                });
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User response: ${outcome}`);
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card border rounded-lg shadow-lg p-4 z-50">
            <button
                onClick={() => setShowPrompt(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
                <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    <Download className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold mb-1">Install Align Network</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                        Install our app for a better experience and quick access.
                    </p>
                    <div className="flex gap-2">
                        <Button onClick={handleInstall} size="sm">
                            Install
                        </Button>
                        <Button
                            onClick={() => setShowPrompt(false)}
                            variant="outline"
                            size="sm"
                        >
                            Not now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo.svg";

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoading(false);
    }, [pathname, searchParams]);

    return (
        <>
            {isLoading && (
                <>
                    <style>{`
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .spin-logo {
              animation: spin-slow 2s linear infinite;
            }
          `}</style>

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
                        <div className="flex flex-col items-center gap-3">
                            <Image
                                src={logo}
                                alt="Align Network Logo"
                                width={48}
                                height={48}
                                className="spin-logo"
                            />
                            <p className="text-sm text-muted-foreground italic">
                                Aligning minds, just for you...
                            </p>
                        </div>
                    </div>
                </>
            )}
            {children}
        </>
    );
}
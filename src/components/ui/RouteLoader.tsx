"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteLoader() {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 800);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return loading ? (
        <div className="fixed top-0 left-0 w-full h-1 bg-primary animate-pulse z-[999]" />
    ) : null;
}

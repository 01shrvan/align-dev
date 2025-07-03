"use client";
import { useEffect, useState } from "react";

export default function DelayedRender({
  delay = 5000,
  children,
}: {
  delay?: number;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return show ? <>{children}</> : null;
}

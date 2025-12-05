"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RouteReloadListener() {
  const router = useRouter();

  useEffect(() => {
    const handle = () => {
      // small delay so page loads, then reload
      setTimeout(() => {
        window.location.reload();
      }, 50);
    };

    // whenever the URL changes → reload page
    window.addEventListener("next-route-change", handle);

    return () => window.removeEventListener("next-route-change", handle);
  }, []);

  return null;
}

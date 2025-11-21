"use client";

// import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // const { isAuthenticated } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/auth/signin");
  //   }
  // }, [isAuthenticated, router]);

  // if (!isAuthenticated) {
  //   return (
  //     <div className="h-screen flex items-center justify-center text-muted-foreground">
  //       Redirecting to Sign In...
  //     </div>
  //   );
  // }

  return <>{children}</>;
}

"use client";

import Link from "next/link";

export default function ReloadLink({ href, children, ...props }: any) {
  const handleClick = () => {
    window.dispatchEvent(new Event("next-route-change"));
  };

  return (
    <Link href={href} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}

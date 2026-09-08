import type { ReactNode } from "react";

export default function Template({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="page-transition">
      <div
        className="page-transition__veil"
        aria-hidden="true"
      />

      <div className="page-transition__content">
        {children}
      </div>
    </div>
  );
}

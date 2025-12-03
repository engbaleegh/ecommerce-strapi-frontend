import React, { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage() {
  // Wrap client component in Suspense to satisfy prerender requirements
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          جارٍ التحميل...
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}

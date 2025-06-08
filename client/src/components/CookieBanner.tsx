import React from "react";
import { useState } from "react";

export default function CookieBanner() {
  const [dismissed, setDismissed] = useState(
    localStorage.getItem("cookie-ack") === "1"
  );
  if (dismissed) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 bg-indigo-800 text-white p-2">
      We use an HttpOnly cookie to keep you signed in.&nbsp;
      <button
        className="underline"
        onClick={() => {
          localStorage.setItem("cookie-ack", "1");
          setDismissed(true);
        }}
      >
        Got it
      </button>
    </div>
  );
}

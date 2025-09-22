"use client";

import { useEffect, useState } from "react";

const Shimmer: React.FC = () => {
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(true); // aktifkan shimmer
      const timeout = setTimeout(() => setActive(false), 2000); // shimmer muncul 2 detik

      return () => clearTimeout(timeout);
    }, 10000); // tiap 10 detik

    return () => clearInterval(interval); // bersihkan interval saat unmount
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className={`absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent ${
          active ? "animate-shimmer" : ""
        }`}
      ></div>
    </div>
  );
};

export default Shimmer;

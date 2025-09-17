"use client";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="" cz-shortcut-listen="true">
        <div className="h-[50pt] w-full shadow-sm border-b border-gray-200 flex flex-row gap-4 items-center justify-between px-8">
          <div className="text-3xl font-bold text-gray-800">
            <span className="pr-1">🎲</span>UTN FRC - SIM
          </div>
          <div className="text-xl font-bold text-gray-800">
            Trabajo Práctico Final
          </div>
        </div>
        <div className="w-full px-8 mt-8">{children}</div>
      </body>
    </html>
  );
}

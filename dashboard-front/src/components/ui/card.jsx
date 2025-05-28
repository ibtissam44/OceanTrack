import React from "react";

export function Card({ children }) {
  return (
    <div className="rounded-2xl shadow-md bg-white dark:bg-gray-900 p-4">
      {children}
    </div>
  );
}
export function CardHeader({ children }) {
  return (
    <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
      {children}
    </div>
  );
}

// عنوان البطاقة
export function CardTitle({ children }) {
  return (
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
      {children}
    </h3>
  );
}

// محتوى البطاقة
export function CardContent({ children }) {
  return <div className="mt-2">{children}</div>;
}

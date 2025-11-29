import { ReactNode } from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}

export default function Card({ title, value, icon, className }: CardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-6 flex items-center justify-between transform-gpu hover:-translate-y-1 hover:scale-105 transition-all duration-500 ${className ?? ""}`}
    >
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <p className="mt-4 text-2xl font-bold text-blue-700">{value}</p>
      </div>
      {icon && <div className="text-4xl text-blue-500">{icon}</div>}
    </div>
  );
}

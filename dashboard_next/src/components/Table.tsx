import { ReactNode } from "react";

export interface TableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T) => ReactNode;
}

export default function Table<T>({ headers, data, renderRow }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-3xl shadow-2xl p-4 bg-gradient-to-br from-white via-blue-50 to-blue-100 animate-fadeIn">
      <table className="min-w-full border-collapse text-gray-800">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white uppercase text-sm tracking-wider rounded-t-2xl drop-shadow-lg">
            {headers.map((h) => (
              <th key={h} className="p-3 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-white/70 backdrop-blur-sm"
            >
              {renderRow(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React from "react";

/**
 * AnimatedTable - Table with smooth animations
 */
const AnimatedTable = ({
  headers = [],
  rows = [],
  onRowClick,
  loading = false,
  SkeletonComponent
}) => {
  if (loading && SkeletonComponent) {
    return <SkeletonComponent />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <table className="w-full bg-white">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left font-semibold"
                style={{
                  animation: `slideInDown 0.4s ease-out ${idx * 0.05}s both`
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={row.id || rowIdx}
              onClick={() => onRowClick?.(row)}
              style={{
                animation: `fadeIn 0.4s ease-out ${(rowIdx + 1) * 0.05}s both`
              }}
              className="border-b border-gray-200 hover:bg-blue-50 transition-all duration-300 cursor-pointer hover:scale-100 hover:shadow-sm"
            >
              {row.cells?.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-6 py-4 text-gray-700"
                >
                  {typeof cell === "string" ? cell : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnimatedTable;

import React from 'react';

const DataTable = ({ title, headers, data, getStatusColor }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-clip">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 ">
            {Array.isArray(data) && data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {headers.map((header, hIdx) => (
                  <td key={hIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {header.key === 'status' ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(row[header.key])}`}>
                        {row[header.key].replace(/_/g, ' ').toLowerCase()
                                       .replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    ) : (
                      row[header.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable; 
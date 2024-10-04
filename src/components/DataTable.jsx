import './DataTable.css';
// eslint-disable-next-line
const DataTable = ({ data, headers }) => {
  data = data.filter((el) => el[0] != '' && el[1] != '');

  return (
    <>
      {/* Table for larger screens */}
      <div className="hidden md:block">
        <table id="data-table" className=" divide-y divide-gray-300">
          <thead className="bg-gray-50 min-w-auto">
            <tr>
              {/* eslint-disable-next-line */}
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="py-3.5 pl-4 pr-3 mr-2 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                >
                  <div className="flex items-center w-auto">
                    <div className="inline-block">{header}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {/* eslint-disable-next-line */}
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* eslint-disable-next-line */}
                {headers.map((header, index) => (
                  <td
                    key={index}
                    className="whitespace-nowrap py-3.5 pl-4 pr-3 text-sm text-gray-500"
                  >
                    {row[index]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Card layout for smaller screens */}
      <div className="block md:hidden">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="border rounded-lg shadow-sm p-4 mb-4 bg-white"
          >
            {row.map((cell, index) => (
              <div key={index} className="mb-2">
                <span className="block font-semibold text-gray-700">
                  {headers[index]}:
                </span>
                <span className="text-gray-600">{cell}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default DataTable;

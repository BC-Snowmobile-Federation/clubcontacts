import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/slice";
import SideMenu from "./SideMenu";
import MainContent from "./MainContent";
import SearchBar from "./SearchBar";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  let { data } = useSelector((state) => state.reducer);

  let headers = [
    "Name",
    "Lastname",
    "Mail",
    "Phone Number",
    "Gender",
    "Effective Date",
    "Role",
    "Status",
    "Amilia",
    "Last Update",
    "Spreadsheet ID",
    "Club Name",
  ];

  if (!data || data.length < 1) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Side Menu */}
      <SideMenu />
      {/* Main Content */}
      <MainContent />
      {/* SearchBar */}
      <SearchBar />

      <div className="mt-1 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg max-w-screen">
              <table
                id="data-table"
                className="w-full divide-y divide-gray-300"
              >
                <thead className="bg-gray-50 min-w-auto">
                  <tr>
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
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

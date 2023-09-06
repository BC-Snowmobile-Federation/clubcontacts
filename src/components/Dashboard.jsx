import { useEffect, useState } from "react";
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
    "Email",
    "Club Name",
    "Phone Number",
    "Gender",
    "Effective Date",
    "Role",
    "Status",
    "Amilia",
    "Last Update",
  ];

  data = data.map((row) => {
    const item9 = row[11];
    const before = row.slice(0, 3);
    const after = row.slice(3, 10);
    return [...before, item9, ...after];
  });

  let { isBcsf } = useSelector((state) => state.reducer);
  isBcsf = true;

  const rolePosition = isBcsf ? 7 : 6;

  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line

  const [filteredRoleData, setFilteredRoleData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredRoleData(data);
    }
  }, [data]);

  useEffect(() => {
    // Filter based on search query
    const newFilteredData = data.filter((row) =>
      row.some((cell) => 
        typeof cell === "string" && cell.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    if (JSON.stringify(newFilteredData) !== JSON.stringify(filteredRoleData)) {
      setFilteredRoleData(newFilteredData);
    }
  }, [searchQuery, data, filteredRoleData]);

  const handleRoleChange = (selectedRole) => {
    let newFilteredData;
    if (selectedRole === "All") {
      newFilteredData = [...data];
    } else {
      newFilteredData = data.filter((row) => row[rolePosition] === selectedRole);
    }
    
    if (JSON.stringify(newFilteredData) !== JSON.stringify(filteredRoleData)) {
      setFilteredRoleData(newFilteredData);
    }
  };

  if (!data || data.length < 1) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Side Menu */}
      <SideMenu />
      <div className="lg:pl-[280px]">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <div id="historicalDiv">
                {/* Main Content */}
                <MainContent
                  originalData={filteredRoleData}
                  handleRoleChange={handleRoleChange}
                  rolePosition={rolePosition}
                />
                {/* SearchBar */}
                <SearchBar setSearchQuery={setSearchQuery} />

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
                            {filteredRoleData.map((row, rowIndex) => (
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

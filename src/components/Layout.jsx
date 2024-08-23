import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-1/5" : "w-16"
        } h-screen bg-gray-800 text-white p-4 fixed top-0 left-0 transition-all duration-300 z-30`}
      >
        <div className="flex items-center justify-between mb-4">
          {isSidebarOpen && (
            <h2 className="text-xl font-bold tracking-widest text-yellow-500 font-sans uppercase">
              Office Inventory
            </h2>
          )}
          <button
            className="text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {isSidebarOpen && (
          <ul className="space-y-4 mt-10">
            <li className="py-2 px-4 rounded hover:bg-gray-700">
              <Link to="/employees" className="block hover:text-gray-400">
                Add Employees
              </Link>
            </li>
            <li className="py-2 px-4 rounded hover:bg-gray-700">
              <Link to="/devices" className="block hover:text-gray-400">
                Add Devices
              </Link>
            </li>

            {/* <li className="py-2 px-4 rounded hover:bg-gray-700">
              <Link to="/add-employee" className="block hover:text-gray-400">
                Add Employee
              </Link>
            </li>
            <li className="py-2 px-4 rounded hover:bg-gray-700">
              <Link to="/assign-device" className="block hover:text-gray-400">
                Assign Device
              </Link>
            </li> */}

            <li className="py-2 px-4 rounded hover:bg-gray-700">
              <Link to="/departments" className="hover:text-gray-400">
                Add Department
              </Link>
            </li>
            <li className="py-2 px-4 rounded hover:bg-gray-700">
              <Link to="/deviceType" className="hover:text-gray-400">
                Add deviceType
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Main content area */}
      <div
        className={`flex-1 ml-${
          isSidebarOpen ? "1/4" : "16"
        } pl-4 transition-all duration-300`}
        style={{
          marginLeft: isSidebarOpen ? "20%" : "4rem",
          paddingLeft: "1rem",
        }}
      >
        {/* Top bar */}
        <div className="bg-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold"></h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Main content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Layout;

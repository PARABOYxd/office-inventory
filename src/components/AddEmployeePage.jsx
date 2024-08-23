// AddEmployeePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AddEmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/employees", newEmployee);
      fetchEmployees();
      setNewEmployee({ name: "", email: "" });
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Add Employee</h1>
      <form onSubmit={handleAddEmployee} className="space-y-4">
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={newEmployee.name}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, name: e.target.value })
            }
            className="border p-2 rounded-md w-full"
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={newEmployee.email}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, email: e.target.value })
            }
            className="border p-2 rounded-md w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add Employee
        </button>
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Employees</h2>
        <ul className="space-y-4">
          {employees.map((employee) => (
            <li
              key={employee.id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              {employee.name} - {employee.email}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 space-x-4">
        <Link
          to="/assign-device"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Assign Device
        </Link>
      </div>
    </div>
  );
};

export default AddEmployeePage;

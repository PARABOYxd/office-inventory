// AssignDevicePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AssignDevicePage = () => {
  const [employees, setEmployees] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [assignedDevices, setAssignedDevices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchDevices();
    fetchAssignedDevices();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/devices");
      setDevices(response.data.filter((device) => !device.assigned));
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const fetchAssignedDevices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/assigned-devices"
      );
      setAssignedDevices(response.data);
    } catch (error) {
      console.error("Error fetching assigned devices:", error);
    }
  };

  const handleAssignDevice = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedDevice) {
      setError("Please select both employee and device");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/assign-device", {
        employee_id: selectedEmployee,
        device_id: selectedDevice,
      });
      fetchAssignedDevices();
      fetchDevices();
      setSelectedEmployee("");
      setSelectedDevice("");
    } catch (error) {
      console.error("Error assigning device:", error);
      setError("Failed to assign device");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Assign Device</h1>
      <form onSubmit={handleAssignDevice} className="space-y-4">
        <div>
          <label>Employee:</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="border p-2 rounded-md w-full"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Device:</label>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="border p-2 rounded-md w-full"
            required
          >
            <option value="">Select Device</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Assign Device
        </button>
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Assigned Devices</h2>
        <ul className="space-y-4">
          {assignedDevices.map((assignment) => (
            <li
              key={assignment.id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              {assignment.employee.name} - {assignment.device.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <Link
          to="/add-employee"
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add Employee
        </Link>
      </div>
    </div>
  );
};

export default AssignDevicePage;

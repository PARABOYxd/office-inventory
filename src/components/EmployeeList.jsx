import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

// Set the app element for accessibility
Modal.setAppElement("#root");

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [devices, setDevices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    position: "",
    device_id: "",
  });
  const [editEmployee, setEditEmployee] = useState(null);
  const [addErrors, setAddErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchDevices();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/inventory/api/employees/"
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/inventory/api/devices/"
      );
      setDevices(response.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/inventory/api/departments/"
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const validateForm = (employee) => {
    const errors = {};
    if (!employee.first_name) errors.first_name = "First name is required.";
    if (!employee.last_name) errors.last_name = "Last name is required.";
    if (!employee.email) errors.email = "Email is required.";
    if (!employee.department) errors.department = "Department is required.";
    if (!employee.position) errors.position = "Position is required.";
    if (!employee.device_id) {
      errors.device_id = "Device is required.";
    } else {
      const deviceAssigned = employees.some(
        (emp) => emp.device?.id === parseInt(employee.device_id)
      );
      if (
        deviceAssigned &&
        (!editEmployee || editEmployee.device_id !== employee.device_id)
      ) {
        errors.device_id =
          "This device is already assigned to another employee.";
      }
    }
    return errors;
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(newEmployee);
    if (Object.keys(validationErrors).length > 0) {
      setAddErrors(validationErrors);
      return;
    }
    setAddErrors({});

    try {
      const response = await axios.post(
        "http://localhost:8000/inventory/api/employees/",
        { ...newEmployee, device: parseInt(newEmployee.device_id) }
      );
      if (response.status === 201) {
        fetchEmployees();
        setNewEmployee({
          first_name: "",
          last_name: "",
          email: "",
          department: "",
          position: "",
          device_id: "",
        });
        setModalIsOpen(false);
      }
    } catch (error) {
      console.error(
        "Error adding employee:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleEditEmployee = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(editEmployee);
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors);
      return;
    }
    setEditErrors({});
    try {
      const response = await axios.put(
        `http://localhost:8000/inventory/api/employees/${editEmployee.id}/`,
        { ...editEmployee, device: parseInt(editEmployee.device_id) }
      );
      if (response.status === 200) {
        fetchEmployees();
        setEditEmployee(null);
        setModalIsOpen(false);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(
        "Error editing employee:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/inventory/api/employees/${id}/`
      );
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const openModal = (employee = null) => {
    if (employee) {
      setEditEmployee({
        ...employee,
        device_id: employee.device ? employee.device.id : "",
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setNewEmployee({
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        position: "",
        device_id: "",
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditErrors({});
    setAddErrors({});
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Employee Management
      </h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Employee
        </button>
        <button
          onClick={() => navigate("/devices")}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ml-4"
        >
          Add Device
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Employees</h2>
        <ul className="space-y-4">
          {employees.map((employee) => (
            <li
              key={employee.id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold">
                  {employee.first_name} {employee.last_name}
                </h3>
                <p>Email: {employee.email}</p>
                <p>
                  Device:{" "}
                  {employee.device ? employee.device.model_name : "None"}
                </p>
                <p>
                  Assignment Date:{" "}
                  {employee.device_assignment
                    ? new Date(
                        employee.device_assignment.assignment_date
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  Return Date:{" "}
                  {employee.device_assignment &&
                  employee.device_assignment.return_date
                    ? new Date(
                        employee.device_assignment.return_date
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => openModal(employee)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={isEditing ? "Edit Employee" : "Add Employee"}
        className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? "Edit Employee" : "Add Employee"}
        </h2>
        <form
          onSubmit={isEditing ? handleEditEmployee : handleAddEmployee}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                placeholder="First Name"
                value={
                  isEditing ? editEmployee?.first_name : newEmployee.first_name
                }
                onChange={(e) =>
                  isEditing
                    ? setEditEmployee({
                        ...editEmployee,
                        first_name: e.target.value,
                      })
                    : setNewEmployee({
                        ...newEmployee,
                        first_name: e.target.value,
                      })
                }
                className="w-full border p-2 rounded-md"
              />
              {addErrors.first_name && (
                <p className="text-red-500 text-sm">{addErrors.first_name}</p>
              )}
              {editErrors.first_name && (
                <p className="text-red-500 text-sm">{editErrors.first_name}</p>
              )}
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                placeholder="Last Name"
                value={
                  isEditing ? editEmployee?.last_name : newEmployee.last_name
                }
                onChange={(e) =>
                  isEditing
                    ? setEditEmployee({
                        ...editEmployee,
                        last_name: e.target.value,
                      })
                    : setNewEmployee({
                        ...newEmployee,
                        last_name: e.target.value,
                      })
                }
                className="w-full border p-2 rounded-md"
              />
              {addErrors.last_name && (
                <p className="text-red-500 text-sm">{addErrors.last_name}</p>
              )}
              {editErrors.last_name && (
                <p className="text-red-500 text-sm">{editErrors.last_name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={isEditing ? editEmployee?.email : newEmployee.email}
                onChange={(e) =>
                  isEditing
                    ? setEditEmployee({
                        ...editEmployee,
                        email: e.target.value,
                      })
                    : setNewEmployee({ ...newEmployee, email: e.target.value })
                }
                className="w-full border p-2 rounded-md"
              />
              {addErrors.email && (
                <p className="text-red-500 text-sm">{addErrors.email}</p>
              )}
              {editErrors.email && (
                <p className="text-red-500 text-sm">{editErrors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium">
                Department
              </label>
              <select
                id="department"
                value={
                  isEditing ? editEmployee?.department : newEmployee.department
                }
                onChange={(e) =>
                  isEditing
                    ? setEditEmployee({
                        ...editEmployee,
                        department: e.target.value,
                      })
                    : setNewEmployee({
                        ...newEmployee,
                        department: e.target.value,
                      })
                }
                className="w-full border p-2 rounded-md"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {addErrors.department && (
                <p className="text-red-500 text-sm">{addErrors.department}</p>
              )}
              {editErrors.department && (
                <p className="text-red-500 text-sm">{editErrors.department}</p>
              )}
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium">
                Position
              </label>
              <input
                type="text"
                id="position"
                placeholder="Position"
                value={
                  isEditing ? editEmployee?.position : newEmployee.position
                }
                onChange={(e) =>
                  isEditing
                    ? setEditEmployee({
                        ...editEmployee,
                        position: e.target.value,
                      })
                    : setNewEmployee({
                        ...newEmployee,
                        position: e.target.value,
                      })
                }
                className="w-full border p-2 rounded-md"
              />
              {addErrors.position && (
                <p className="text-red-500 text-sm">{addErrors.position}</p>
              )}
              {editErrors.position && (
                <p className="text-red-500 text-sm">{editErrors.position}</p>
              )}
            </div>
            <div>
              <label htmlFor="device_id" className="block text-sm font-medium">
                Device
              </label>
              <select
                id="device_id"
                value={
                  isEditing ? editEmployee?.device_id : newEmployee.device_id
                }
                onChange={(e) =>
                  isEditing
                    ? setEditEmployee({
                        ...editEmployee,
                        device_id: e.target.value,
                      })
                    : setNewEmployee({
                        ...newEmployee,
                        device_id: e.target.value,
                      })
                }
                className="w-full border p-2 rounded-md"
              >
                <option value="">Select Device</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.model_name}
                  </option>
                ))}
              </select>
              {addErrors.device_id && (
                <p className="text-red-500 text-sm">{addErrors.device_id}</p>
              )}
              {editErrors.device_id && (
                <p className="text-red-500 text-sm">{editErrors.device_id}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              {isEditing ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeList;

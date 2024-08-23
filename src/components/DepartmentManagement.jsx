import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [editDepartmentName, setEditDepartmentName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

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

  const handleAddDepartment = async () => {
    try {
      await axios.post("http://localhost:8000/inventory/api/departments/", {
        name: newDepartment,
      });
      setNewDepartment("");
      fetchDepartments();
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const handleEditDepartment = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/inventory/api/departments/${editDepartmentId}/`,
        { name: editDepartmentName }
      );
      setEditMode(false);
      setEditDepartmentId(null);
      setEditDepartmentName("");
      fetchDepartments();
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/inventory/api/departments/${id}/`
      );
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Department Management</h1>
      {!editMode ? (
        <div>
          <input
            type="text"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            placeholder="New Department Name"
            className="border p-2 m-2"
          />
          <button
            onClick={handleAddDepartment}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Department
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={editDepartmentName}
            onChange={(e) => setEditDepartmentName(e.target.value)}
            placeholder="Edit Department Name"
            className="border p-2 m-2"
          />
          <button
            onClick={handleEditDepartment}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        </div>
      )}

      <ul className="mt-4 space-y-4">
        {departments.map((department) => (
          <li
            key={department.id}
            className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center"
          >
            {editMode && editDepartmentId === department.id ? (
              <span>{editDepartmentName}</span>
            ) : (
              <span>{department.name}</span>
            )}
            {editMode && editDepartmentId === department.id ? (
              <div>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setEditMode(true);
                    setEditDepartmentId(department.id);
                    setEditDepartmentName(department.name);
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDepartment(department.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentManagement;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

const DeviceTypeManagement = () => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [newDeviceType, setNewDeviceType] = useState("");
  const [editDeviceType, setEditDeviceType] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  const fetchDeviceTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/inventory/api/device-types/"
      );
      setDeviceTypes(response.data);
    } catch (error) {
      console.error("Error fetching device types:", error);
    }
  };

  const handleAddDeviceType = async (e) => {
    e.preventDefault();
    if (!newDeviceType) {
      setErrors({ newDeviceType: "Device type name is required." });
      return;
    }
    setErrors({});
    try {
      await axios.post("http://localhost:8000/inventory/api/device-types/", {
        name: newDeviceType,
      });
      setNewDeviceType("");
      fetchDeviceTypes();
      closeModal();
    } catch (error) {
      console.error("Error adding device type:", error);
    }
  };

  const handleEditDeviceType = async (e) => {
    e.preventDefault();
    if (!editDeviceType || !editDeviceType.name) {
      setErrors({ editDeviceType: "Device type name is required." });
      return;
    }
    setErrors({});
    try {
      await axios.put(
        `http://localhost:8000/inventory/api/device-types/${editDeviceType.id}/`,
        { name: editDeviceType.name }
      );
      fetchDeviceTypes();
      setEditDeviceType(null);
      closeModal();
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing device type:", error);
    }
  };

  const handleDeleteDeviceType = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/inventory/api/device-types/${id}/`
      );
      fetchDeviceTypes();
    } catch (error) {
      console.error("Error deleting device type:", error);
    }
  };

  const openModal = (deviceType = null) => {
    if (deviceType) {
      setEditDeviceType(deviceType);
      setIsEditing(true);
    } else {
      setNewDeviceType("");
      setEditDeviceType(null);
      setIsEditing(false);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setErrors({});
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Device Type Management
      </h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Device Type
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Device Types</h2>
        <ul className="space-y-4">
          {deviceTypes.map((deviceType) => (
            <li
              key={deviceType.id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <span>{deviceType.name}</span>
              <div className="flex space-x-4">
                <button
                  onClick={() => openModal(deviceType)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDeviceType(deviceType.id)}
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
        contentLabel={isEditing ? "Edit Device Type" : "Add Device Type"}
        className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? "Edit Device Type" : "Add Device Type"}
        </h2>
        <form
          onSubmit={isEditing ? handleEditDeviceType : handleAddDeviceType}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Device Type Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Device Type Name"
              value={isEditing ? editDeviceType?.name || "" : newDeviceType}
              onChange={(e) => {
                if (isEditing) {
                  setEditDeviceType({
                    ...editDeviceType,
                    name: e.target.value,
                  });
                } else {
                  setNewDeviceType(e.target.value);
                }
              }}
              className="w-full border p-2 rounded-md"
            />
            {errors.newDeviceType && !isEditing && (
              <span className="text-red-500">{errors.newDeviceType}</span>
            )}
            {errors.editDeviceType && isEditing && (
              <span className="text-red-500">{errors.editDeviceType}</span>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-4"
            >
              {isEditing ? "Update Device Type" : "Add Device Type"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DeviceTypeManagement;

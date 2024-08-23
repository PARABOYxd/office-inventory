import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [newDevice, setNewDevice] = useState({
    model_name: "",
    serial_number: "",
    device_type: "",
    purchase_date: "",
  });
  const [editDevice, setEditDevice] = useState(null);
  const [addErrors, setAddErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [modalType, setModalType] = useState(null); // For managing modals
  const [newDeviceType, setNewDeviceType] = useState("");
  const [editDeviceType, setEditDeviceType] = useState(null);
  const [modalErrors, setModalErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchDevices();
    fetchDeviceTypes();
  }, []);

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

  const validateForm = (device) => {
    const errors = {};
    if (!device.model_name) errors.model_name = "Model name is required.";
    if (!device.serial_number)
      errors.serial_number = "Serial number is required.";
    if (!device.device_type) errors.device_type = "Device type is required.";
    if (!device.purchase_date)
      errors.purchase_date = "Purchase date is required.";
    return errors;
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(newDevice);
    if (Object.keys(validationErrors).length > 0) {
      setAddErrors(validationErrors);
      return;
    }
    setAddErrors({});
    try {
      await axios.post(
        "http://localhost:8000/inventory/api/devices/",
        newDevice
      );
      fetchDevices();
      setNewDevice({
        model_name: "",
        serial_number: "",
        device_type: "",
        purchase_date: "",
      });
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  const handleEditDevice = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(editDevice);
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors);
      return;
    }
    setEditErrors({});
    try {
      await axios.put(
        `http://localhost:8000/inventory/api/devices/${editDevice.id}/`,
        editDevice
      );
      fetchDevices();
      setEditDevice(null);
    } catch (error) {
      console.error("Error editing device:", error);
    }
  };

  const handleDeleteDevice = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/inventory/api/devices/${id}/`);
      fetchDevices();
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  const validateDeviceTypeForm = (deviceType) => {
    const errors = {};
    if (!deviceType) errors.device_type = "Device type name is required.";
    return errors;
  };

  const handleAddDeviceType = async (e) => {
    e.preventDefault();
    const validationErrors = validateDeviceTypeForm(newDeviceType);
    if (Object.keys(validationErrors).length > 0) {
      setModalErrors(validationErrors);
      return;
    }
    setModalErrors({});
    try {
      await axios.post("http://localhost:8000/inventory/api/device-types/", {
        name: newDeviceType,
      });
      fetchDeviceTypes();
      setNewDeviceType("");
      setModalType(null);
    } catch (error) {
      console.error("Error adding device type:", error);
    }
  };

  const handleEditDeviceType = async (e) => {
    e.preventDefault();
    const validationErrors = validateDeviceTypeForm(editDeviceType.name);
    if (Object.keys(validationErrors).length > 0) {
      setModalErrors(validationErrors);
      return;
    }
    setModalErrors({});
    try {
      await axios.put(
        `http://localhost:8000/inventory/api/device-types/${editDeviceType.id}/`,
        editDeviceType
      );
      fetchDeviceTypes();
      setEditDeviceType(null);
      setModalType(null);
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Device Management</h1>
        <div className="flex space-x-4 ml-auto">
          <button
            onClick={() => setModalType("device-type")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Manage Device Types
          </button>
          <button
            onClick={() => navigate("/employees")}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add Employee
          </button>
        </div>
      </div>

      {/* Add Device Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Device</h2>
        <form onSubmit={handleAddDevice} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="model_name" className="block text-sm font-medium">
                Model Name
              </label>
              <input
                type="text"
                id="model_name"
                placeholder="Model Name"
                value={newDevice.model_name}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, model_name: e.target.value })
                }
                className="w-full border p-2 rounded-md"
              />
              {addErrors.model_name && (
                <span className="text-red-500">{addErrors.model_name}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="serial_number"
                className="block text-sm font-medium"
              >
                Serial Number
              </label>
              <input
                type="text"
                id="serial_number"
                placeholder="Serial Number"
                value={newDevice.serial_number}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, serial_number: e.target.value })
                }
                className="w-full border p-2 rounded-md"
              />
              {addErrors.serial_number && (
                <span className="text-red-500">{addErrors.serial_number}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="device_type"
                className="block text-sm font-medium"
              >
                Device Type
              </label>
              <select
                id="device_type"
                value={newDevice.device_type}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, device_type: e.target.value })
                }
                className="w-full border p-2 rounded-md"
              >
                <option value="">Select Device Type</option>
                {deviceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {addErrors.device_type && (
                <span className="text-red-500">{addErrors.device_type}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="purchase_date"
                className="block text-sm font-medium"
              >
                Purchase Date
              </label>
              <input
                type="date"
                id="purchase_date"
                value={newDevice.purchase_date}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, purchase_date: e.target.value })
                }
                className="w-full border p-2 rounded-md"
              />
              {addErrors.purchase_date && (
                <span className="text-red-500">{addErrors.purchase_date}</span>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Add Device
            </button>
          </div>
        </form>
      </div>

      {/* Edit Device Form */}
      {editDevice && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Edit Device</h2>
          <form onSubmit={handleEditDevice} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="edit_model_name"
                  className="block text-sm font-medium"
                >
                  Model Name
                </label>
                <input
                  type="text"
                  id="edit_model_name"
                  placeholder="Model Name"
                  value={editDevice.model_name}
                  onChange={(e) =>
                    setEditDevice({ ...editDevice, model_name: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                />
                {editErrors.model_name && (
                  <span className="text-red-500">{editErrors.model_name}</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="edit_serial_number"
                  className="block text-sm font-medium"
                >
                  Serial Number
                </label>
                <input
                  type="text"
                  id="edit_serial_number"
                  placeholder="Serial Number"
                  value={editDevice.serial_number}
                  onChange={(e) =>
                    setEditDevice({
                      ...editDevice,
                      serial_number: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-md"
                />
                {editErrors.serial_number && (
                  <span className="text-red-500">
                    {editErrors.serial_number}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="edit_device_type"
                  className="block text-sm font-medium"
                >
                  Device Type
                </label>
                <select
                  id="edit_device_type"
                  value={editDevice.device_type}
                  onChange={(e) =>
                    setEditDevice({
                      ...editDevice,
                      device_type: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-md"
                >
                  <option value="">Select Device Type</option>
                  {deviceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {editErrors.device_type && (
                  <span className="text-red-500">{editErrors.device_type}</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="edit_purchase_date"
                  className="block text-sm font-medium"
                >
                  Purchase Date
                </label>
                <input
                  type="date"
                  id="edit_purchase_date"
                  value={editDevice.purchase_date}
                  onChange={(e) =>
                    setEditDevice({
                      ...editDevice,
                      purchase_date: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded-md"
                />
                {editErrors.purchase_date && (
                  <span className="text-red-500">
                    {editErrors.purchase_date}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditDevice(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Device List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Devices</h2>
        <ul className="space-y-4">
          {devices.map((device) => {
            // Find the device type name using the device type ID
            const deviceTypeName =
              deviceTypes.find((type) => type.id === device.device_type)
                ?.name || "Unknown"; // Default to 'Unknown' if not found

            return (
              <li
                key={device.id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold">{device.model_name}</h3>
                  <p>Serial Number: {device.serial_number}</p>
                  <p>Device Type: {deviceTypeName}</p>
                  <p>Purchase Date: {device.purchase_date}</p>
                  <p>Status: {device.status}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setEditDevice(device)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDevice(device.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Modals */}
      {modalType === "device-type" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h2 className="text-2xl font-semibold mb-4">
              {editDeviceType ? "Edit Device Type" : "Add Device Type"}
            </h2>
            <form
              onSubmit={
                editDeviceType ? handleEditDeviceType : handleAddDeviceType
              }
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="device_type_name"
                  className="block text-sm font-medium"
                >
                  Device Type Name
                </label>
                <input
                  type="text"
                  id="device_type_name"
                  placeholder="Device Type Name"
                  value={editDeviceType ? editDeviceType.name : newDeviceType}
                  onChange={(e) =>
                    editDeviceType
                      ? setEditDeviceType({
                          ...editDeviceType,
                          name: e.target.value,
                        })
                      : setNewDeviceType(e.target.value)
                  }
                  className="w-full border p-2 rounded-md"
                />
                {modalErrors.device_type && (
                  <span className="text-red-500">
                    {modalErrors.device_type}
                  </span>
                )}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  {editDeviceType ? "Save Changes" : "Add Device Type"}
                </button>
                <button
                  onClick={() => {
                    setModalType(null);
                    setEditDeviceType(null);
                    setNewDeviceType("");
                    setModalErrors({});
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                {editDeviceType && (
                  <button
                    onClick={() => {
                      handleDeleteDeviceType(editDeviceType.id);
                      setModalType(null);
                      setEditDeviceType(null);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceList;

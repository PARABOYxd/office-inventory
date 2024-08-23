// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DeviceList from "./components/DeviceList";
import EmployeeList from "./components/EmployeeList";
import AddEmployeePage from "./components/AddEmployeePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import AssignDevicePage from "./components/AssignDevicePage";
import Layout from "./components/Layout";
import DepartmentManagement from "./components/DepartmentManagement";
import DeviceTypeManagement from "./components/DeviceTypeManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route
            path="/"
            element={
              <Layout>
                <DeviceList />
              </Layout>
            }
          />
          <Route
            path="/devices"
            element={
              <Layout>
                <DeviceList />
              </Layout>
            }
          />
          <Route
            path="/employees"
            element={
              <Layout>
                <EmployeeList />
              </Layout>
            }
          />
          <Route
            path="/add-employee"
            element={
              <Layout>
                <AddEmployeePage />
              </Layout>
            }
          />
          <Route
            path="/assign-device"
            element={
              <Layout>
                <AssignDevicePage />
              </Layout>
            }
          />
          <Route
            path="/departments"
            element={
              <Layout>
                <DepartmentManagement />
              </Layout>
            }
          />
          <Route
            path="/deviceType"
            element={
              <Layout>
                <DeviceTypeManagement />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

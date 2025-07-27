import './App.css';
// 
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeView from "./components/EmployeeView";
import EmployeeList from "./components/EmployeeList";
import Report from "./components/report"; // Make sure this matches file casing exactly

function Home() {
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [reload, setReload] = useState(false);

  const handleAdd = () => setReload(!reload);

  const handleEdit = (emp) => {
    setSelected(emp);
    setShowForm(true);
  };

  const handleView = (emp) => {
    setSelected(emp);
    setShowForm(false);
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Employee Payroll Management</h2>
        <button
          className="btn btn-success"
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
        >
          + Add Employee
        </button>
      </div>

      <div className="mb-4">
        {showForm ? (
          <EmployeeForm
            onAdd={handleAdd}
            selected={selected}
            clearSelected={() => setShowForm(false)}
          />
        ) : (
          <EmployeeView selected={selected} onClose={() => setSelected(null)} />
        )}
      </div>

      <EmployeeList onEdit={handleEdit} onView={handleView} reload={reload} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <header className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <h1 className="h3">Payroll System</h1>
          <nav>
            <Link to="/" className="btn btn-outline-primary me-2">🏠 Home</Link>
            <Link to="/report" className="btn btn-outline-secondary">📊 Payroll Report</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


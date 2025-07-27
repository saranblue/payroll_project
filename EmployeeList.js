import React, { useEffect, useState } from 'react';
import axios from 'axios';


const EmployeeList = ({ onEdit, onView, reload }) => {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    const res = await axios.get('http://localhost:5000/api/employees');

    setEmployees(res.data);
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees(); // refresh list
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
      <h2>Employee List</h2>
    <ul className="list-group">
      {employees.map(emp => (
        <li key={emp.id} className="list-group-item d-flex justify-content-between align-items-center">
          {emp.name} - {emp.position} - {emp.department} - Hired on {emp.hire_date}
          <div>
            <button className="btn btn-primary btn-sm me-2" onClick={() => onView(emp)}>View</button>
            <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(emp)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
    </div>
  );
};

export default EmployeeList;

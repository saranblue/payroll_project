import React from 'react';

const EmployeeView = ({ selected, onClose }) => {
  if (!selected) return null;

  return (
    <div className="card mt-4 shadow-sm border-0">
      <div className="card-body">
        <h4 className="card-title text-primary mb-3">{selected.name}</h4>

        <div className="row mb-2">
          <div className="col-md-6"><strong>Contact:</strong> {selected.contact_info}</div>
          <div className="col-md-6"><strong>Hire Date:</strong> {selected.hire_date}</div>
        </div>
        <div className="row mb-2">
          <div className="col-md-6"><strong>Position:</strong> {selected.position}</div>
          <div className="col-md-6"><strong>Department:</strong> {selected.department}</div>
        </div>

        <hr />

        <h5 className="text-secondary mb-3">Salary Breakdown</h5>
        <ul className="list-group mb-3">
          <li className="list-group-item d-flex justify-content-between">
            <span>Basic Salary</span>
            <strong>₹{Number(selected.basic_salary || 0).toFixed(2)}</strong>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Overtime Rate</span>
            <strong>₹{Number(selected.overtime_rate || 0).toFixed(2)}/hr</strong>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Bonus</span>
            <strong>₹{Number(selected.bonus || 0).toFixed(2)}</strong>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Fixed Deductions</span>
            <strong>₹{Number(selected.fixed_deductions || 0).toFixed(2)}</strong>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Variable Deductions</span>
            <strong>₹{Number(selected.variable_deductions || 0).toFixed(2)}</strong>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Income Tax</span>
            <strong className="text-danger">₹{Number(selected.tax || 0).toFixed(2)}</strong>
          </li>
          <li className="list-group-item d-flex justify-content-between bg-light">
            <span className="fw-bold">Net Salary</span>
            <strong className="text-success">₹{Number(selected.net_salary || 0).toFixed(2)}</strong>
          </li>
        </ul>

        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          <button
            className="btn btn-primary"
            onClick={async () => {
              const res = await fetch(`http://localhost:5000/api/employees/${selected.id}/payslip`);
              const data = await res.json();
              alert(JSON.stringify(data, null, 2)); // For now, display JSON
            }}
          >
            Generate Payslip
          </button>

          <a
            className="btn btn-outline-success"
            href={`http://localhost:5000/api/employees/${selected.id}/payslip/pdf`}
            target="_blank"
            rel="noreferrer"
          >
            Download Payslip (PDF)
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Report = () => {
  const [report, setReport] = useState(null);

  const fetchReport = async () => {
    const res = await axios.get('http://localhost:5000/api/report');
    setReport(res.data);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (!report) return <p>Loading report...</p>;

  return (
    <div className="card mt-4 p-3">
      <h4>Payroll Report</h4>
      <p><strong>Total Employees:</strong> {report.total_employees}</p>
      <p><strong>Total Gross Pay:</strong> ₹{report.total_gross.toFixed(2)}</p>
      <p><strong>Total Deductions:</strong> ₹{report.total_deductions.toFixed(2)}</p>
      <p><strong>Total Tax:</strong> ₹{report.total_tax.toFixed(2)}</p>
      <p><strong>Total Net Pay:</strong> ₹{report.total_net_pay.toFixed(2)}</p>

      <h5 className="mt-3">Employee Summary</h5>
      <ul className="list-group">
        {report.employees.map(emp => (
          <li key={emp.id} className="list-group-item">
            {emp.name}: Net ₹{emp.net_salary.toFixed(2)}, Tax ₹{emp.tax.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Report;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// At the top of the file (outside the component)
const emptyForm = {
  name: '',
  contact_info: '',
  position: '',
  department: '',
  hire_date: '',
  basic_salary: '',
  overtime_rate: '',
  bonus: '',
  fixed_deductions: '',
  variable_deductions: ''
};

const EmployeeForm = ({ onAdd, selected, clearSelected }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (selected) {
      setForm({
        ...emptyForm,
        ...selected
      });
    } else {
      setForm(emptyForm);
    }
  }, [selected]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selected) {
        await axios.put(`http://localhost:5000/api/employees/${selected.id}`, form);
      } else {
        await axios.post('http://localhost:5000/api/employees', form);
      }
      setForm(emptyForm);
      clearSelected();
      onAdd();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-4">
        <input type="text" name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="col-md-4">
        <input type="text" name="contact_info" className="form-control" placeholder="Contact Info" value={form.contact_info} onChange={handleChange} required />
      </div>
      <div className="col-md-4">
        <input type="text" name="position" className="form-control" placeholder="Position" value={form.position} onChange={handleChange} required />
      </div>
      <div className="col-md-4">
        <input type="text" name="department" className="form-control" placeholder="Department" value={form.department} onChange={handleChange} required />
      </div>
      <div className="col-md-4">
        <input type="date" name="hire_date" className="form-control" value={form.hire_date} onChange={handleChange} required />
      </div>

      <div className="col-md-4">
        <input type="number" name="basic_salary" className="form-control" placeholder="Basic Salary" value={form.basic_salary} onChange={handleChange} />
      </div>
      <div className="col-md-4">
        <input type="number" name="overtime_rate" className="form-control" placeholder="Overtime Rate" value={form.overtime_rate} onChange={handleChange} />
      </div>
      <div className="col-md-4">
        <input type="number" name="bonus" className="form-control" placeholder="Bonus" value={form.bonus} onChange={handleChange} />
      </div>
      <div className="col-md-4">
        <input type="number" name="fixed_deductions" className="form-control" placeholder="Fixed Deductions" value={form.fixed_deductions} onChange={handleChange} />
      </div>
      <div className="col-md-4">
        <input type="number" name="variable_deductions" className="form-control" placeholder="Variable Deductions" value={form.variable_deductions} onChange={handleChange} />
      </div>

      <div className="col-md-4">
        <button type="submit" className="btn btn-success w-100">
          {selected ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;

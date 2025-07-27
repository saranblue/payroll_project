# 💼 Payroll Management System

A full-stack Payroll Management System built with **React.js** (frontend) and **Flask** (backend), featuring employee management, net salary calculation, payslip generation, and reporting.

---

## 📌 Features

- ✅ Add, edit, delete employee records
- ✅ View detailed salary breakdown (gross, deductions, tax, net pay)
- ✅ Automatic tax calculation (flat 10%)
- ✅ PDF payslip generation and download
- ✅ Monthly payroll summary reporting
- ✅ SQLite database integration
- ✅ Responsive and professional UI with Bootstrap

---

## 🛠 Tech Stack

**Frontend:**  
- React.js  
- Axios  
- Bootstrap

**Backend:**  
- Flask  
- SQLAlchemy  
- SQLite  
- ReportLab (for PDF generation)

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```
git clone https://github.com/saranblue/payroll_project.git
cd payroll_project
```
---
### 2️⃣ Backend Setup (Flask)
```
cd backend
python -m venv venv
venv\Scripts\activate   # On Windows
pip install -r requirements.txt
python app.py
Runs on: http://localhost:5000
```

### 3️⃣ Frontend Setup (React)
```
cd frontend
npm install
npm start
Runs on: http://localhost:3000
```
### 📁 Project Structure
<pre><code>## 📁 Project Structure <details> <summary>Click to expand</summary> ``` payroll_project/ ├── backend/ │ ├── app.py │ ├── models.py │ ├── database.db │ ├── requirements.txt │ ├── frontend/ │ ├── public/ │ ├── src/ │ │ ├── components/ │ │ │ ├── EmployeeForm.js │ │ │ ├── EmployeeList.js │ │ │ ├── EmployeeView.js │ │ │ └── Report.js │ │ ├── Home.js │ │ ├── App.js │ │ └── index.js │ ├── package.json │ ├── .gitignore ├── README.md └── LICENSE ``` </details> </code></pre>








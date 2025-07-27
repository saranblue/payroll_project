from flask import Flask, request, jsonify,send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import datetime
from flask import make_response
from reportlab.pdfgen import canvas
from io import BytesIO
from sqlalchemy import extract, func

app = Flask(__name__)
CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///payroll.db'
db = SQLAlchemy(app)

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    contact_info = db.Column(db.String(100))
    position = db.Column(db.String(100))
    department = db.Column(db.String(100))
    hire_date = db.Column(db.Date)
    basic_salary = db.Column(db.Float)
    overtime_rate = db.Column(db.Float)
    bonus = db.Column(db.Float)
    fixed_deductions = db.Column(db.Float)
    variable_deductions = db.Column(db.Float)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact_info': self.contact_info,
            'position': self.position,
            'department': self.department,
            'hire_date': self.hire_date.strftime('%Y-%m-%d') if self.hire_date else None,
            'basic_salary': self.basic_salary,
            'overtime_rate': self.overtime_rate,
            'bonus': self.bonus,
            'fixed_deductions': self.fixed_deductions,
            'variable_deductions': self.variable_deductions
        }



@app.route("/")
def home():
    return "Flask backend is running. Use /api/employees for API."

def calculate_salary_details(emp):
    basic = emp.basic_salary if emp.basic_salary is not None else 0
    overtime = emp.overtime_rate or 0
    bonus = emp.bonus or 0
    fixed = emp.fixed_deductions or 0
    variable = emp.variable_deductions or 0
    gross_income = basic + bonus + overtime
    total_deductions = fixed + variable
    taxable_income = gross_income - total_deductions
    tax_rate = 0.10  # 10% flat tax
    tax = max(taxable_income * tax_rate, 0)
    net_salary = taxable_income - tax

    return {
        'tax': round(tax, 2),
        'net_salary': round(net_salary, 2)
    }


@app.route('/api/employees', methods=['GET'])
def get_employees():
    print("✅ GET all employees request received")
    employees = Employee.query.all()
    result = []

    for emp in employees:
        data = emp.to_dict()
        salary_details = calculate_salary_details(emp)
        data.update(salary_details)
        result.append(data)
    return jsonify(result)

@app.route("/api/employees", methods=["POST"])
def add_employee():
    data = request.json
    employee = Employee(
        name=data["name"],
        contact_info=data["contact_info"],
        position=data["position"],
        department=data["department"],
        hire_date=datetime.datetime.strptime(data["hire_date"], "%Y-%m-%d").date(),
        basic_salary=data.get("basic_salary", 0),
        overtime_rate=data.get("overtime_rate", 0),
        bonus=data.get("bonus", 0),
        fixed_deductions=data.get("fixed_deductions", 0),
        variable_deductions=data.get("variable_deductions", 0)
    )
    db.session.add(employee)
    db.session.commit()
    return jsonify({"message": "Employee added!"}), 201

@app.route("/api/employees/<int:employee_id>", methods=["DELETE"])
def delete_employee(employee_id):
    employee = Employee.query.get_or_404(employee_id)
    db.session.delete(employee)
    db.session.commit()
    return jsonify({"message": "Employee deleted!"})

@app.route("/api/employees/<int:employee_id>", methods=["PUT"])
def update_employee(employee_id):
    data = request.get_json()
    try:
        employee = Employee.query.get_or_404(employee_id)
        employee.name = data.get("name", employee.name)
        employee.contact_info = data.get("contact_info", employee.contact_info)
        employee.position = data.get("position", employee.position)
        employee.department = data.get("department", employee.department)
        employee.basic_salary = data.get("basic_salary", employee.basic_salary)
        employee.overtime_rate = data.get("overtime_rate", employee.overtime_rate)
        employee.bonus = data.get("bonus", employee.bonus)
        employee.fixed_deductions = data.get("fixed_deductions", employee.fixed_deductions)
        employee.variable_deductions = data.get("variable_deductions", employee.variable_deductions)

        if "hire_date" in data:
            employee.hire_date = datetime.datetime.strptime(data["hire_date"], "%Y-%m-%d").date()

        db.session.commit()
        return jsonify({"message": "Employee updated successfully!"}), 200
    except Exception as e:
        print("UPDATE ERROR:", e)  
        return jsonify({"error": "Failed to update employee", "details": str(e)}), 500

@app.route("/api/employees/<int:employee_id>/payslip", methods=["GET"])
def generate_payslip(employee_id):
    emp = Employee.query.get_or_404(employee_id)
    salary = calculate_salary_details(emp)

    payslip_data = {
        "employee": {
            "name": emp.name,
            "position": emp.position,
            "department": emp.department,
            "hire_date": emp.hire_date.strftime("%Y-%m-%d")
        },
        "payslip": {
            "basic_salary": emp.basic_salary or 0,
            "overtime_rate": emp.overtime_rate or 0,
            "bonus": emp.bonus or 0,
            "fixed_deductions": emp.fixed_deductions or 0,
            "variable_deductions": emp.variable_deductions or 0,
            "tax": salary['tax'],
            "net_salary": salary['net_salary'],
            "pay_period": "July 2025"
        }
    }

    return jsonify(payslip_data)    


@app.route("/api/employees/<int:employee_id>/payslip/pdf", methods=["GET"])
def generate_payslip_pdf(employee_id):
    emp = Employee.query.get_or_404(employee_id)
    salary = calculate_salary_details(emp)
    buffer = BytesIO()
    p = canvas.Canvas(buffer)
    p.setFont("Helvetica", 12)
    p.drawString(50, 800, f"Payslip for {emp.name} - July 2025")
    p.drawString(50, 780, f"Position: {emp.position}")
    p.drawString(50, 760, f"Department: {emp.department}")
    p.drawString(50, 740, f"Hire Date: {emp.hire_date.strftime('%Y-%m-%d')}")
    p.drawString(50, 720, f"Basic Salary: ₹{emp.basic_salary}")
    p.drawString(50, 700, f"Overtime Rate: ₹{emp.overtime_rate}")
    p.drawString(50, 680, f"Bonus: ₹{emp.bonus}")
    p.drawString(50, 660, f"Fixed Deductions: ₹{emp.fixed_deductions}")
    p.drawString(50, 640, f"Variable Deductions: ₹{emp.variable_deductions}")
    p.drawString(50, 620, f"Tax: ₹{salary['tax']}")
    p.drawString(50, 600, f"Net Salary: ₹{salary['net_salary']}")

    p.showPage()
    p.save()
    buffer.seek(0)

    return send_file(buffer, as_attachment=True, download_name='payslip.pdf', mimetype='application/pdf')

@app.route('/api/report', methods=['GET'])
def payroll_report():
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)

    query = Employee.query
    if month and year:
        query = query.filter(
            extract('month', Employee.hire_date) == month,
            extract('year', Employee.hire_date) == year
        )

    employees = query.all()
    report = {
        'total_employees': len(employees),
        'total_gross': 0,
        'total_deductions': 0,
        'total_tax': 0,
        'total_net_pay': 0,
        'employees': []
    }

    for emp in employees:
        details = calculate_salary_details(emp)
        gross = (emp.basic_salary or 0) + (emp.bonus or 0) + (emp.overtime_rate or 0)
        deductions = (emp.fixed_deductions or 0) + (emp.variable_deductions or 0)

        report['total_gross'] += gross
        report['total_deductions'] += deductions
        report['total_tax'] += details['tax']
        report['total_net_pay'] += details['net_salary']
        report['employees'].append({
            'id': emp.id,
            'name': emp.name,
            'net_salary': details['net_salary'],
            'tax': details['tax'],
        })

    return jsonify(report)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
    

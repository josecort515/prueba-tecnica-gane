import employeesData from "../data/employees.json";
import { EmployeesResponse, Employee } from "../interfaces/interfaces";

class EmployeeService {
    private employees: Employee[];

    constructor() {
        const parsedData: EmployeesResponse = JSON.parse(JSON.stringify(employeesData));
        this.employees = parsedData.data;
    }

    getAllEmployees(): Employee[] {
        return [...this.employees];
    }

    getEmployeeById(id: number): Employee | undefined {
        return this.employees.find((employee) => employee.id === id);
    }

    getEmployeesByName(name: string): Employee[] {
        return this.employees.filter((employee) =>
            employee.attributes.first_name.toLowerCase().includes(name.toLowerCase())
        );
    }

    getEmployeesByLastName(lastName: string): Employee[] {
        return this.employees.filter((employee) =>
            employee.attributes.last_name.toLowerCase().includes(lastName.toLowerCase())
        );
    }

    getEmployeesByEmail(email: string): Employee[] {
        return this.employees.filter((employee) =>
            employee.attributes.email.toLowerCase().includes(email.toLowerCase())
        );
    }

    getEmployeesByCharge(charge: string): Employee[] {
        return this.employees.filter((employee) =>
            employee.attributes.charge.toLowerCase().includes(charge.toLowerCase())
        );
    }

    getEmployeesBySalary(minSalary: number, maxSalary: number): Employee[] {
        return this.employees.filter(
            (employee) => employee.attributes.salary >= minSalary && employee.attributes.salary <= maxSalary
        );
    }
}

export default new EmployeeService();

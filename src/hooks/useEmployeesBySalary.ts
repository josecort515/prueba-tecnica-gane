import { useEffect, useState } from "react";
import EmployeeService from "../services/EmployeeService";
import { Employee } from "../interfaces/interfaces";

const useEmployeesBySalary = (minSalary: number, maxSalary: number) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const data = EmployeeService.getEmployeesBySalary(minSalary, maxSalary);
        setEmployees(data);
        setLoading(false);
    }, [minSalary, maxSalary]);

    return { employees, loading };
};

export default useEmployeesBySalary;

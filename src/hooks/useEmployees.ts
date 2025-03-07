import { useEffect, useState } from "react";
import EmployeeService from "../services/EmployeeService";
import { Employee } from "../interfaces/interfaces";

const useEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const data = EmployeeService.getAllEmployees();
        setEmployees(data);
        setLoading(false);
    }, []);

    return { employees, loading };
};

export default useEmployees;

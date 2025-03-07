import { useEffect, useState } from "react";
import EmployeeService from "../services/EmployeeService";
import { Employee } from "../interfaces/interfaces";

const useEmployeesByEmail = (email: string) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const data = EmployeeService.getEmployeesByEmail(email);
        setEmployees(data);
        setLoading(false);
    }, [email]);

    return { employees, loading };
};

export default useEmployeesByEmail;

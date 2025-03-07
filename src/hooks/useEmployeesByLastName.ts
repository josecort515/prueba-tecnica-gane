import { useEffect, useState } from "react";
import EmployeeService from "../services/EmployeeService";
import { Employee } from "../interfaces/interfaces";

const useEmployeesByLastName = (lastName: string) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const data = EmployeeService.getEmployeesByLastName(lastName);
        setEmployees(data);
        setLoading(false);
    }, [lastName]);

    return { employees, loading };
};

export default useEmployeesByLastName;

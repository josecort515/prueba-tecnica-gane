import { useEffect, useState } from "react";
import EmployeeService from "../services/EmployeeService";
import { Employee } from "../interfaces/interfaces";

const useEmployeesByName = (name: string) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const data = EmployeeService.getEmployeesByName(name);
        setEmployees(data);
        setLoading(false);
    }, [name]);

    return { employees, loading };
};

export default useEmployeesByName;

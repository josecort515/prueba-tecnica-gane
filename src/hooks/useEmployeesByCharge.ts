import { useEffect, useState } from "react";
import EmployeeService from "../services/EmployeeService";
import { Employee } from "../interfaces/interfaces";

const useEmployeesByCharge = (charge: string) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const data = EmployeeService.getEmployeesByCharge(charge);
        setEmployees(data);
        setLoading(false);
    }, [charge]);

    return { employees, loading };
};

export default useEmployeesByCharge;

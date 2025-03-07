import Search from "antd/es/input/Search";
// import useEmployeesByCharge from "../hooks/useEmployeesByCharge";
// import useEmployeesByEmail from "../hooks/useEmployeesByEmail";
// import useEmployeesByLastName from "../hooks/useEmployeesByLastName";
// import useEmployeesByName from "../hooks/useEmployeesByName";
// import useEmployeesBySalary from "../hooks/useEmployeesBySalary";

// const { employees: employeesByName } = useEmployeesByName("Juan");
// const { employees: employeesByLastName } = useEmployeesByLastName("González");
// const { employees: employeesByEmail } = useEmployeesByEmail("correo@example.com");
// const { employees: employeesByCharge } = useEmployeesByCharge("Ingeniero");
// const { employees: employeesBySalary } = useEmployeesBySalary(3000, 7000);



const EmployeeSearch = () => {
    

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Search placeholder="Buscar empleado" enterButton="Buscar" size="large" />

           
        </div>
    );
};

export default EmployeeSearch;







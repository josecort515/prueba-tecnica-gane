import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Employee } from "../interfaces/interfaces";
import EmployeeService from "../services/EmployeeService";
import CustomHeader from "../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import { Divider, Spin, theme } from "antd";
import "./EmployeeDetail.css";
import WorkshiftService from "../services/WorkshiftService";
import AccessControlService from "../services/AccessControlService";
import { SalaryCalculatorService } from "../services/SalaryCalculatorService";
import PersonalInfoSection from "../components/PersonalInfoSection";
import WorkScheduleSection from "../components/WorkScheduleSection";
import SalaryInfoSection from "../components/SalaryInfoSection";

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = theme.useToken();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeData = EmployeeService.getEmployeeById(Number(id));
        if (employeeData) {
          setEmployee(employeeData);
        }
      } catch (error) {
        console.error("Error al cargar datos del empleado:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Cargando información del empleado..." />
      </div>
    );
  }

  if (!employee) {
    return <div>No se encontró información del empleado.</div>;
  }

  // Cálculos de datos
  const hoursExtra = AccessControlService.getAllAccessControl(employee);
  const salaryCalculatorService = new SalaryCalculatorService();
  const salarioFinal = salaryCalculatorService.salarioDevengar(
    employee.attributes.salary,
    hoursExtra
  );
  const totalHorasTrabajadas = AccessControlService.getAllWorkedHours(employee);
  
  const horasExtras = hoursExtra.reduce((total, record) => {
    return (
      total +
      record.hour_extra.reduce(
        (subtotal, extra) =>
          !["RC", "RD", "RND"].includes(extra.type)
            ? subtotal + extra.hour
            : subtotal,
        0
      )
    );
  }, 0);

  const recargos = hoursExtra.reduce((total, record) => {
    return (
      total +
      record.hour_extra.reduce(
        (subtotal, extra) =>
          ["RC", "RD", "RND"].includes(extra.type)
            ? subtotal + extra.hour
            : subtotal,
        0
      )
    );
  }, 0);

  const workShiftType = WorkshiftService.getWorkshtifType(employee);

  return (
    <>
      <CustomHeader titulo={"Información de empleado"} backRoute="/" />
      <Content
        style={{
          margin: "24px 16px",
          background: token.colorBgContainer,
          minHeight: 280,
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <PersonalInfoSection employee={employee} />

        <Divider />

        <WorkScheduleSection 
          employee={employee} 
          workShiftType={workShiftType}
          horasExtras={horasExtras}
          recargos={recargos}
          totalHorasTrabajadas={totalHorasTrabajadas}
        />

        <Divider />

        <SalaryInfoSection 
          accessControl={hoursExtra}
          salarioBase={employee.attributes.salary}
          salarioFinal={salarioFinal}
        />
      </Content>
    </>
  );
};

export default EmployeeDetail;

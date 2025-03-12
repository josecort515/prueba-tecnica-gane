import React from "react";
import { Col, Row, Statistic } from "antd";
import ScheduleEmploye from "../components/ScheduleEmploye";
import AccessControlEmployee from "../components/AccessControlEmployee";
import { Employee } from "../interfaces/interfaces";

interface WorkScheduleSectionProps {
  employee: Employee;
  workShiftType: string;
  horasExtras: number;
  recargos: number;
  totalHorasTrabajadas: number;
}

const WorkScheduleSection: React.FC<WorkScheduleSectionProps> = ({
  employee,
  workShiftType,
  horasExtras,
  recargos,
  totalHorasTrabajadas
}) => {
  return (
    <div className="horario-section">
      <h3>Horario de trabajo</h3>
      <Row className="row-info">
        <Col className="col-info" span={8}>
          <Statistic title="Tipo de horario" value={workShiftType} />
          <ScheduleEmploye employee={employee} />
        </Col>

        <Col className="col-info" span={16}>
          <Row>
            <Col span={24}>
              <Row justify="space-around">
                <Statistic 
                  title="Horas extras en el mes" 
                  value={horasExtras} 
                />
                <Statistic 
                  title="Recargos en el mes" 
                  value={recargos} 
                />
                <Statistic 
                  title="Horas trabajadas en el mes" 
                  value={totalHorasTrabajadas} 
                />
              </Row>
              <AccessControlEmployee employee={employee} />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default WorkScheduleSection;
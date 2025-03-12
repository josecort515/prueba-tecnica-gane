import React from "react";
import { Col, Row, Statistic, StatisticProps } from "antd";
import { DollarCircleTwoTone } from "@ant-design/icons";
import CountUp from "react-countup";
import { Employee } from "../interfaces/interfaces";

interface PersonalInfoSectionProps {
  employee: Employee;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ employee }) => {
  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp start={0} end={value as number} separator="." duration={2} />
  );

  return (
    <div className="info-section">
      <h3>Información Personal</h3>

      <Row className="row-info">
        <Col className="col-info" span={8}>
          <Statistic title="Identificación" value={employee.id} />
        </Col>
        <Col className="col-info" span={8}>
          <Statistic
            title="Nombre"
            value={employee.attributes.first_name}
          />
        </Col>
        <Col className="col-info" span={8}>
          <Statistic
            title="Apellido"
            value={employee.attributes.last_name}
          />
        </Col>
      </Row>

      <Row className="row-info">
        <Col className="col-info" span={8}>
          <Statistic
            title="Ocupación"
            value={employee.attributes.charge}
          />
        </Col>
        <Col className="col-info" span={8}>
          <Statistic
            title="Correo electrónico"
            value={employee.attributes.email}
          />
        </Col>
        <Col className="col-info" span={8}>
          <Statistic
            title="Celular"
            value={employee.attributes.phone}
          />
        </Col>
      </Row>

      <Row className="row-info">
        <Col span={8} className="col-info">
          <Statistic
            title="Salario base"
            value={employee.attributes.salary}
            formatter={formatter}
            prefix={<DollarCircleTwoTone />}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PersonalInfoSection;
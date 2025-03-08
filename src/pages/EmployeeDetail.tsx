import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Employee } from "../interfaces/interfaces";
import EmployeeService from "../services/EmployeeService";
import CustomHeader from "../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import { Col, Divider, Row, Statistic, Tag, theme } from "antd";
import "./EmployeeDetail.css";
import { DollarCircleTwoTone } from "@ant-design/icons";
import WorkshiftService from "../services/WorkshiftService";

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);

  const { token } = theme.useToken();

  useEffect(() => {
    const fetchEmployee = () => {
      const employeeData = EmployeeService.getEmployeeById(Number(id));
      if (employeeData) {
        setEmployee(employeeData);
      }
    };

    fetchEmployee();
  }, [id]);

  if (!employee) {
    return <div>Cargando...</div>;
  }

  const salary = Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(employee.attributes.salary);

  interface DescriptionItemProps {
    title: string;
    content: React.ReactNode;
  }

  const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">{title}:</p>
      {content}
    </div>
  );
  return (
    <div>
      <CustomHeader titulo={"Informacion de empleado"}></CustomHeader>
      <Content
        style={{
          margin: "24px 16px",
          background: token.colorBgContainer,
          minHeight: 280,
        }}
      >
        <div style={{ padding: "20px" }}>
          <h3>Informacion Personal</h3>

          <Row className="row-info">
            <Col className="col-info" span={8}>
              <Statistic title="Identificacion" value={employee.id}></Statistic>
            </Col>
            <Col className="col-info" span={8}>
              <Statistic
                title="Nombre"
                value={employee.attributes.last_name}
              ></Statistic>
            </Col>
            <Col className="col-info" span={8}>
              <Statistic
                title="Apellido"
                value={employee.attributes.last_name}
              ></Statistic>
            </Col>
          </Row>

          <Row className="row-info">
            <Col className="col-info" span={8}>
              <Statistic
                title="Ocupación"
                value={employee.attributes.charge}
              ></Statistic>
            </Col>
            <Col className="col-info" span={8}>
              <Statistic
                title="Correo electronico"
                value={employee.attributes.email}
              ></Statistic>
            </Col>
            <Col className="col-info" span={8}>
              <Statistic
                title="Celular"
                value={employee.attributes.phone}
              ></Statistic>
            </Col>
          </Row>

          <Row className="row-info">
            <Col className="col-info-salary" span={8}>
              <label>Salario base</label>
              <Tag icon={<DollarCircleTwoTone />} color="processing">
                {salary}
              </Tag>
            </Col>
          </Row>
        </div>

        <Divider />

        <div className="horario">
          <h3>Horario de trabajo</h3>
          <Row className="row-info">
            <Col className="col-info" span={8}>
              <Statistic
                title="Tipo de horario"
                value={WorkshiftService.getWorkshtifType(employee)}
              ></Statistic>
            </Col>
            <Col className="col-info" span={8}>
              <Statistic
                title="Hora de salida"
                value={employee.attributes.end_hour}
              ></Statistic>
            </Col>
            <Col className="col-info" span={8}>
              <Statistic
                title="Dias laborales"
                value={employee.attributes.work_days}
              ></Statistic>
            </Col>
          </Row>
        </div>
        <Row>
          <Col span={12}>
            <DescriptionItem title="City" content="HangZhou" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Country" content="China🇨🇳" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Birthday" content="February 2,1900" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Website" content="-" />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Message"
              content="Make things as simple as possible but no simpler."
            />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">Company</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Position" content="Programmer" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Responsibilities" content="Coding" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Department" content="XTech" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Supervisor" content={<a>Lin</a>} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Skills"
              content="C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc."
            />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">Contacts</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Email" content="AntDesign@example.com" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Phone Number" content="+86 181 0000 0000" />
          </Col>
        </Row>
      </Content>
    </div>
  );
};

export default EmployeeDetail;

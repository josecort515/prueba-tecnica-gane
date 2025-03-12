import React from "react";
import { Col, Row, Statistic, StatisticProps, Tag } from "antd";
import { DollarCircleTwoTone } from "@ant-design/icons";
import SalaryDetail from "../components/SalaryDetail";
import CountUp from "react-countup";

interface SalaryInfoSectionProps {
  accessControl: any[]; // Reemplazar con el tipo adecuado de tu interfaz
  salarioBase: number;
  salarioFinal: number;
}

const SalaryInfoSection: React.FC<SalaryInfoSectionProps> = ({
  accessControl,
  salarioBase,
  salarioFinal
}) => {
  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp start={0} end={value as number} separator="." duration={3} />
  );

  return (
    <div className="salary-section">
      <h3>Información de Salario</h3>
      <Row className="row-info">
        <Col className="col-info" span={14}>
          <Statistic
            title="Total horas y recargos"
            value={"Extras + Recargos"}
          />
          <SalaryDetail accesControl={accessControl} />
        </Col>

        <Col className="col-info" span={10}>
          <Tag color="blue" style={{ textAlign: "center"}}>
            <Statistic
              style={{ padding: "10px" }}
              title="Salario a devengar: extras + recargos + base"
              value={salarioFinal}
              formatter={formatter}
              prefix={<DollarCircleTwoTone />}
            />
          </Tag>
          
          <div className="salary-summary" style={{ marginTop: "20px", padding: "10px" }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic 
                  title="Salario base" 
                  value={salarioBase}
                  formatter={formatter}
                  prefix={<DollarCircleTwoTone />}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Adicionales" 
                  value={salarioFinal - salarioBase}
                  formatter={formatter}
                  prefix={<DollarCircleTwoTone />}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SalaryInfoSection;
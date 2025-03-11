import React, { useState, useEffect } from "react";
import { Row, Table, Tag } from "antd";
import { Employee, HourExtra } from "../interfaces/interfaces";
import AccessControlService from "../services/AccessControlService";

interface AccessControlEmployeProps {
  employee: Employee;
}

const AcessControlEmploye: React.FC<AccessControlEmployeProps> = ({
  employee,
}) => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccessControl = async () => {
      const acessControl = AccessControlService.getAllAccessControl(employee);
      setDataSource(acessControl);
    };

    fetchAccessControl();
  }, [employee]);

  const tagColorType = (type: string) => {
    switch (type) {
      case "HED":
        return "red";
      case "HEN":
        return "purple";
      case "HEDD":
        return "orange";
      case "HEDN":
        return "green";
      case "RC":
        return "cyan";
      case "RD":
        return "magenta";
      case "RND":
        return "geekblue";
      default:
        return '';
    };
  }

  const columns = [
    {
      title: "Dia",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "Ingreso",
      dataIndex: "start",
      key: "start",
    },
    {
      title: "Salida",
      dataIndex: "finish",
      key: "finish",
    },
    {
      title: "Horas extra",
      dataIndex: "hour_extra",
      key: "hour_extra",
      render: (hourExtras: HourExtra[]) => (
            hourExtras.map((extra, index) => (
              <Row key={index}>
                <Tag color={tagColorType(extra.type)} >
                  {(extra.type === 'RD' || extra.type === 'RC')? extra.type : parseFloat(extra.hour.toFixed(0)).toString().concat(' ', extra.type)}
                </Tag>
              </Row>
      )))
    },
    {
      title: "Horas trabajadas",
      dataIndex: "hour_worked",
      key: "hour_worked",
    },
  ];

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ y: 400 }}
        rowHoverable={true}
      />
    </div>
  );
};

export default AcessControlEmploye;


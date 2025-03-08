import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Employee } from '../interfaces/interfaces';
import AccessControlService from '../services/AccessControlService';

interface AcessControlEmployeProps {
  employee: Employee;
}

const AcessControlEmploye: React.FC<AcessControlEmployeProps> = ({ employee }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    // Llamada asíncrona para obtener los datos
    const fetchAccessControl = async () => {
      const acessControl = AccessControlService.getAllAccessControl(employee);
      // Mapeamos los workshifts para obtener la estructura adecuada para la tabla
      const controlAccessData = acessControl.map((access) =>({
        key: access.start,
        start: access.finish,
        finish: access.finish,
        hour_extra: access.hour_extra
        }));
      setDataSource(controlAccessData);
    };

    fetchAccessControl();
  }, [employee]);

  const columns = [
    {
      title: 'Ingreso',
      dataIndex: 'start',
      key: 'start',
    },
    {
      title: 'Salida',
      dataIndex: 'finish',
      key: 'finish',
    },
    {
      title: 'Horas extra',
      dataIndex: 'hour_extra',
      key: 'hour_extra',
    },
  ];

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default AcessControlEmploye;
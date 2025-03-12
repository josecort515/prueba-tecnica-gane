import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import WorkshiftService from '../services/WorkshiftService';
import { Employee } from '../interfaces/interfaces';

interface ScheduleEmployeProps {
  employee: Employee;
}

const ScheduleEmploye: React.FC<ScheduleEmployeProps> = ({ employee }) => {

  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    // Llamada asíncrona para obtener los datos
    const fetchSchedule = async () => {
      const workshifts =  WorkshiftService.getWeekSchedule(employee);
      // Mapeamos los workshifts para obtener la estructura adecuada para la tabla
      const scheduleData = workshifts.map((day) =>({
          key: day.day,
          day: day.day,
          start: day.start_at,
          finish: day.finished_at,
          break: day.break_duration,
        }));
      setDataSource(scheduleData);
    };

    fetchSchedule();
  }, [employee]);

  const columns = [
    {
      title: 'Día',
      dataIndex: 'day',
      key: 'day',
    },
    {
      title: 'Entrada',
      dataIndex: 'start',
      key: 'start',
    },
    {
      title: 'Salida',
      dataIndex: 'finish',
      key: 'finish',
    },
    {
      title: 'Horas de descanso',
      dataIndex: 'break',
      key: 'break',
    },
  ];

  return (
    <div>
      <Table 
      dataSource={dataSource} 
      columns={columns}
      style={{padding:'30px'}}
      pagination={false} />
    </div>
  );
};

export default ScheduleEmploye;

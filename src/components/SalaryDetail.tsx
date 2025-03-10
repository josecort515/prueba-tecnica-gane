import { Table } from "antd";
import type {
  AccessControlEmployee,
  HourExtra,
} from "../interfaces/interfaces";

const SalaryDetail = ({
  accesControl,
}: {
  accesControl: AccessControlEmployee[];
}) => {
  const data: HourExtra[] = [];

  accesControl.map((accesControl) => {
    accesControl.hour_extra.map((as) => {
      data.push(as);
    });
  });

  const columns = [
    {
      title: "Tipo de Hora",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Horas",
      dataIndex: "hour",
      key: "hour",
    },
    {
      title: "Valor por Hora",
      dataIndex: "value",
      key: "value",
      render: (value: number) => (
        <span>
          {new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(value)}
        </span>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <span>
          {new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(total)}
        </span>
      ),
    },
  ];

  const hourExtraGroup = (): HourExtra[] => {
    // Crear un objeto para agrupar las horas extras por tipo
    const groupedHours = data.reduce(
      (acc: { [key: string]: HourExtra }, curr) => {
        if (!acc[curr.type]) {
          // Si el tipo no existe, crear nueva entrada
          acc[curr.type] = {
            type: curr.type,
            hour: curr.hour,
            value: curr.value,
            total: curr.total,
          };
        } else {
          // Si el tipo existe, sumar las horas y el total
          acc[curr.type].hour += curr.hour;
          acc[curr.type].total += curr.total;
        }
        return acc;
      },
      {}
    );

    // Convertir el objeto agrupado en un array
    return Object.values(groupedHours);
  };

  const hourExtraValue = () => {
    let total = 0;
    data.forEach((hour) => {
      total += hour.total;
    });

    return Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(total);
  };
  
  return (
    <>
      <Table
        scroll={{ y: 400 }}
        columns={columns}
        dataSource={hourExtraGroup()}
        bordered
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} align="end">
                Gran total
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="end">
                {}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="end"></Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="end">
                {hourExtraValue()}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
      {/* {data.map((dat) => (
      <li key={dat.type}>{dat.type}: {dat.hour} horas, {dat.value} valor por hora, {dat.total} total</li>
    ))} */}
    </>
  );
};

export default SalaryDetail;

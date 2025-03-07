// import { Button, Space, Table } from 'antd';
// import employeesData from '../data/employees.json';
// import EmployeeSearch from '../components/EmployeeSearch';

// // 1. Listado de empleado.
// // Consumir la API de empleados y mostrar una tabla con los siguientes datos:

// // Nombre
// // Apellido
// // Correo electronico
// // Cargo
// // Salario


// const columns = [
//   {
//     title: 'ID',
//     dataIndex: 'id',
//   },
//   {
//     title: 'Nombre',
//     dataIndex: 'name',
//   },
//   {
//     title: 'Apellido',
//     dataIndex: 'last_name',
//   },
//   {
//     title: 'Email',
//     dataIndex: 'email',
//     with: 100
//   },
//   {
//     title: 'Cargo',
//     dataIndex: 'ocupation',
//   },
//   {
//     title: 'Salario',
//     dataIndex: 'salary',
//   }

// ];

// const dataSource = employeesData.data
// .map((employee) => ({
//   id: employee.id,
//   name: employee.attributes.first_name,
//   last_name: employee.attributes.last_name,
//   email: employee.attributes.email,
//   ocupation: employee.attributes.charge,
//   salary: employee.attributes.salary,
// }));


// export const EmployeeList = () => {
//   return (
//     <div>
//       <EmployeeSearch></EmployeeSearch>
//       <Table
//       columns={columns}
//       dataSource={dataSource}
//       pagination={{
//         pageSize: 50,
//       }}
//       scroll={{
//         y: 200 * 5,
//       }}
//     />
//     </div>
//   );
// };












import { useRef, useState } from 'react';
import Icon, { DeleteFilled, SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { Employee } from '../interfaces/interfaces';
import EmployeeService from '../services/EmployeeService';

type DataIndex = keyof Employee;

const data: Employee[] = EmployeeService.getAllEmployees()?.map((employee) => employee) || [];

const EmployeeList = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | ''>('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Employee> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
          <Button type="link" size="small" onClick={close}>
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      const recordValue = record[dataIndex] ? record[dataIndex].toString().toLowerCase() : '';
      return recordValue.includes((value as string).toLowerCase());
    },
    onFilterDropdownOpenChange: (open) => {
      if (open) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<Employee> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      // width: '10%',
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Nombre',
      dataIndex: ['attributes', 'first_name'],
      key: 'first_name',
      ...getColumnSearchProps('attributes.first_name' as DataIndex),
    },
    {
      title: 'Apellido',
      dataIndex: ['attributes', 'last_name'],
      key: 'last_name',
      ...getColumnSearchProps('attributes.last_name' as DataIndex),
    },
    {
      title: 'Email',
      dataIndex: ['attributes', 'email'],
      key: 'email',
      ...getColumnSearchProps('attributes.email' as DataIndex),
    },
    {
      title: 'Cargo',
      dataIndex: ['attributes', 'charge'],
      key: 'charge',
      ...getColumnSearchProps('attributes.charge' as DataIndex),
    },
    {
      title: 'Salario',
      dataIndex: ['attributes', 'salary'],
      key: 'salary',
      // width: '15%',
      render: (value) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value),
      sorter: (a, b) => a.attributes.salary - b.attributes.salary,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Opciones',
      width: '15%',
      render: () => (
        <Space size="middle">
          <Button
            danger
            icon={<DeleteFilled />}
          ></Button>
          <Button 
            type="primary"
            // href="/employee-detail"
            >Ver detalle
          </Button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Employee[]) => {
      console.log('Selected Row Keys: ', selectedRowKeys);
      console.log('Selected Rows: ', selectedRows);
    },
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      scroll={{
        y: 700,
      }}
      rowKey="id"
      rowHoverable={true}
      tableLayout="auto"
    />
  );
};

export default EmployeeList;

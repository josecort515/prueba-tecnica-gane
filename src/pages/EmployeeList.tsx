import { useRef, useState } from "react";
import {
  SearchOutlined,
} from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Employee } from "../interfaces/interfaces";
import EmployeeService from "../services/EmployeeService";
import { Link } from "react-router-dom";


const data: Employee[] =
  EmployeeService.getAllEmployees()?.map((employee) => employee) || [];

const EmployeeList = () => {

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: string): TableColumnType<Employee> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
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
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      // Manejo diferente según si es un campo anidado o no
      if (dataIndex === 'id') {
        return record.id.toString().toLowerCase().includes((value as string).toLowerCase());
      } else if (['first_name', 'last_name', 'email', 'charge', 'salary'].includes(dataIndex)) {
        // Para campos anidados dentro de attributes
        const attributeValue = record.attributes[dataIndex as keyof typeof record.attributes];
        return attributeValue 
          ? attributeValue.toString().toLowerCase().includes((value as string).toLowerCase())
          : false;
      }
      return false;
    },
    onFilterDropdownOpenChange: (open) => {
      if (open) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record) => {
      // Determinar el texto a mostrar y resaltar según el tipo de columna
      let displayText = text;
      
      if (dataIndex === 'first_name' || dataIndex === 'last_name') {
        displayText = record.attributes[dataIndex];
      }
      
      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={displayText ? displayText.toString() : ""}
        />
      ) : (
        displayText
      );
    }
  });

  const columns: TableColumnsType<Employee> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Nombre",
      dataIndex: ["attributes", "first_name"],
      key: "first_name",
      ...getColumnSearchProps("first_name"),
    },
    {
      title: "Apellido",
      dataIndex: ["attributes", "last_name"],
      key: "last_name",
      ...getColumnSearchProps("last_name"),
    },
    {
      title: "Email",
      dataIndex: ["attributes", "email"],
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Cargo",
      dataIndex: ["attributes", "charge"],
      key: "charge",
      ...getColumnSearchProps("charge"),
    },
    {
      title: "Salario",
      dataIndex: ["attributes", "salary"],
      key: "salary",
      render: (value) =>
        new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
        }).format(value),
      sorter: (a, b) => a.attributes.salary - b.attributes.salary,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Opciones",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          
          <Button
            type="primary"
          >
            <Link
              to={`/employee-detail/${record.id}`}
              style={{ color: "white" }}
            >
              Ver detalle
            </Link>
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
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
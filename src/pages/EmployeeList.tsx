import { useRef, useState } from "react";
import {
  DeleteFilled,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Employee } from "../interfaces/interfaces";
import EmployeeService from "../services/EmployeeService";
import { Link } from "react-router-dom";

type DataIndex = keyof Employee;

const data: Employee[] = EmployeeService.getAllEmployees()?.map((employee) => employee) || [];

const EmployeeList = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | "">("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<Employee> => ({
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
      const recordValue = record[dataIndex]
        ? record[dataIndex].toString().toLowerCase()
        : "";
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
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
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
      dataIndex: "attributes",
      key: "first_name",
      ...getColumnSearchProps("attributes.first_name" as DataIndex),
      render: (attributes) => attributes.first_name,
    },
    {
      title: "Apellido",
      dataIndex: "attributes",
      key: "last_name",
      ...getColumnSearchProps("attributes.last_name" as DataIndex),
      render: (attributes) => attributes.last_name,
    },
    {
      title: "Email",
      dataIndex: ["attributes", "email"],
      key: "email",
      ...getColumnSearchProps("attributes.email" as DataIndex),
    },
    {
      title: "Cargo",
      dataIndex: ["attributes", "charge"],
      key: "charge",
      ...getColumnSearchProps("attributes.charge" as DataIndex),
    },
    {
      title: "Salario",
      dataIndex: ["attributes", "salary"],
      key: "salary",
      // width: '15%',
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
      render: (record) => (
        <Space size="middle">
          <Popconfirm
            placement="topRight"
            title={"Seguro que desea eliminar el empleado?"}
            description={"Esta acción no se puede deshacer"}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            okText="Si"
            cancelText="No"
          >
            <Button danger icon={<DeleteFilled />}></Button>
          </Popconfirm>
          <Button
            onClick={() => null}
            type="primary"
            // href="/employee-detail"
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

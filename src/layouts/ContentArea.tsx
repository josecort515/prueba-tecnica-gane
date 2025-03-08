import React from 'react';
import { Layout, theme } from 'antd';
import EmployeeList from '../pages/EmployeeList';
import CustomHeader from '../components/CustomHeader';

const { Content } = Layout;

const ContentArea: React.FC = () => {
  const { token } = theme.useToken();

  return (
    
    <div>
      <CustomHeader titulo={'Listado de empleados'} subtitle='holiiiiiiiiiis' ></CustomHeader>
      <Content
      style={{
        margin: '24px 16px',
        background: token.colorBgContainer,
        width: '100%'
      }}
    >
      <EmployeeList></EmployeeList>
    </Content>
    </div>
  );
};

export default ContentArea;
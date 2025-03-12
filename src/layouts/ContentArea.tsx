import React from 'react';
import { Layout } from 'antd';
import EmployeeList from '../pages/EmployeeList';
import CustomHeader from '../components/CustomHeader';

const { Content } = Layout;

const ContentArea: React.FC = () => {

  return (
    
    <div>
      <CustomHeader titulo={'Listado de empleados'}></CustomHeader>
      <Content
      style={{
        margin: '24px 16px',
        width: '100%'
      }}
    >
      <EmployeeList></EmployeeList>
    </Content>
    </div>
  );
};

export default ContentArea;
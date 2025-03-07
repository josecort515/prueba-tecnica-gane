import React from 'react';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import CustomHeader from './components/CustomHeader';
import ContentArea from './layouts/ContentArea';

const App: React.FC = () => {
  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Layout style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CustomHeader />
        <ContentArea />
      </Layout>
    </Layout>
  );
};

export default App;

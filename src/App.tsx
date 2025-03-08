import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import CustomHeader from './components/CustomHeader';
import ContentArea from './layouts/ContentArea';
import EmployeeDetail from './pages/EmployeeDetail';

const { Sider, Header, Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ width: '100%', minHeight: '100vh' }}>
        <Sider style={{ position: 'fixed', height: '100vh', zIndex: 2 }}>
          <Sidebar />
        </Sider>
        <Layout style={{ marginLeft: 200, width: 'calc(100% - 200px)' }}>
          
          <Content style={{ marginTop: 64, padding: '24px', overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
            <Routes>
              <Route path="/" element={<ContentArea />} />
              <Route path="/employee-detail/:id" element={<EmployeeDetail />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;

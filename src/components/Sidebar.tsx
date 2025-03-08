import React from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';

const { Sider } = Layout;

const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
  (icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `Nav ${index + 1}`,
  })
);

const Sidebar: React.FC = () => {
  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => console.log(broken)}
      onCollapse={(collapsed, type) => console.log(collapsed, type)}
    >
      <div className="demo-logo-vertical" />
      <img src="https://th.bing.com/th/id/OIP.Rwn0yo-pFqQQlL8F3FOcZAHaHa?rs=1&pid=ImgDetMain" alt="Logo Gane" style={{width:'100%', marginBottom:'20px'}}/>
      
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />
    </Sider>
  );
};

export default Sidebar;

import React from 'react';
import { Layout, theme, Typography } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

interface CustomHeaderProps {
  titulo: string;
  subtitle?: string;
  content?: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = (CustomHeaderProps) => {
  const { token } = theme.useToken();

  return (
    <Header 
      style={{
        padding: '0 16px', 
        background: token.colorBgContainer,
        height: 64,
        lineHeight: '64px',
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        zIndex: 1,
        boxShadow: '0 1px 4px rgba(0,21,41,.08)'
      }} 
    >
      <Title level={4} style={{ margin: 0 }}>{CustomHeaderProps.titulo}</Title>
      <Title level={5} style={{ margin: 0 }}>{CustomHeaderProps.subtitle}</Title>
      <Title level={5} style={{ margin: 0 }}>{CustomHeaderProps.content}</Title>
    </Header>
  );
};

export default CustomHeader;
import React from 'react';
import { Layout, theme, Typography } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

const CustomHeader: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Header 
      style={{ 
        padding: '0 16px', 
        background: token.colorBgContainer,
        height: 64,
        lineHeight: '64px', // Añadido para alinear correctamente
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%', // Asegurar que ocupa todo el ancho
        zIndex: 1, // Para asegurar que está por encima del contenido
        boxShadow: '0 1px 4px rgba(0,21,41,.08)' // Añadir sombra para mejor distinción
      }} 
    >
      <Title level={4} style={{ margin: 0 }}>Mi Aplicación</Title>
    </Header>
  );
};

export default CustomHeader;
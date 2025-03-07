import React from 'react';
import { Layout, theme } from 'antd';

const { Content } = Layout;

const ContentArea: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Content
      style={{
        margin: '16px',
        padding: '16px',
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        flex: 1, // Asegurar que ocupa todo el espacio disponible
        overflow: 'auto', // Para permitir scroll si el contenido es extenso
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ flex: 1 }}>
        <h1>Contenido Principal</h1>
        <p>Aquí va el contenido de tu aplicación. Puedes reemplazar esto con componentes o vistas específicas.</p>
      </div>
    </Content>
  );
};

export default ContentArea;
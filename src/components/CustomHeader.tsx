import React from 'react';
import { Layout, theme, Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

interface CustomHeaderProps {
  titulo: string;
  subtitle?: string;
  content?: string;
  callBack?: Function;
  backRoute?: string; // Ruta para volver atrás
  onBack?: () => void; // Función personalizada para volver atrás
}

const CustomHeader: React.FC<CustomHeaderProps> = (props) => {
  const { 
    titulo, 
    subtitle, 
    content, 
    backRoute, 
  } = props;
  
  const { token } = theme.useToken();
  const navigate = useNavigate();

  // Función para manejar el clic en el botón de atrás
  const handleBackClick = () => {
    if (backRoute) {
      navigate(backRoute);
    }
  };

  const showBackButton = backRoute !== undefined ;

  return (
    <Header 
      style={{
        padding: '0 16px', 
        background: token.colorBgContainer,
        height: 64,
        lineHeight: '64px',
        display: 'flex',
        alignItems: 'center', // Cambiado de 'start' a 'center' para mejor alineación
        width: '100%',
        zIndex: 1,
        boxShadow: '0 1px 4px rgba(0,21,41,.08)'
      }} 
    >
      <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        width: '100%' 
      }}>
        {showBackButton && (
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBackClick}
            style={{ marginRight: 16 }}
          />
        )}
        <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <Title level={4} style={{ margin: 0 }}>{titulo}</Title>
          {subtitle && <Title level={5} style={{ margin: 0 }}>{subtitle}</Title>}
          {content && <Title level={5} style={{ margin: 0 }}>{content}</Title>}
        </div>
      </div>
    </Header>
  );
};

export default CustomHeader;
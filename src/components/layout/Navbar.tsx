"use client";

import React from 'react';
import { Layout, Segmented, Typography } from 'antd';
import { UserOutlined, AreaChartOutlined } from '@ant-design/icons';
import { ViewMode } from '@/types/view';

const { Header } = Layout;
const { Title } = Typography;

interface NavbarProps {
    viewMode: ViewMode;
    onViewModeChange: (view: ViewMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ viewMode, onViewModeChange }) => {
    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                borderBottom: '1px solid #f0f0f0',
                padding: '0 24px', // Ajuste de padding para telas menores
            }}
        >
            <Title level={3} style={{ margin: 0, color: '#ec6725', fontSize: '1.2rem' }}>
                NEO Chamados
            </Title>
            <Segmented<ViewMode>
                options={[
                    { label: 'Técnico', value: 'Técnico', icon: <UserOutlined /> },
                    { label: 'Gestor', value: 'Gestor', icon: <AreaChartOutlined /> },
                ]}
                value={viewMode}
                onChange={onViewModeChange}
            />
        </Header>
    );
};

export default Navbar;

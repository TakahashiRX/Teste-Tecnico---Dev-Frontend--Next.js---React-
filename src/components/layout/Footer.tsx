"use client";

import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer: AntdFooter } = Layout;
const { Text } = Typography;

const Footer: React.FC = () => {
    return (
        <AntdFooter style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}>
            <Text type="secondary">
                Plataforma NEO ©{new Date().getFullYear()} - Criado por Rodrigo Takahashi para Teste Técnico.
            </Text>
        </AntdFooter>
    );
};

export default Footer;

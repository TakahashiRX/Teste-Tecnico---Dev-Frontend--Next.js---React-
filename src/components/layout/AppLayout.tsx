"use client";

import React, { useState } from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar';
import Footer from './Footer';
import { ViewMode } from '@/types/view';

const { Content } = Layout;

interface AppLayoutProps {
    children: (viewMode: ViewMode) => React.ReactNode;
}

/**
 * AppLayout é o principal componente de layout estrutural.
 * Ele gerencia o estado da visão (Técnico/Gestor) e orquestra
 * a Navbar, o conteúdo principal (main) e o Footer.
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('Técnico');

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar viewMode={viewMode} onViewModeChange={setViewMode} />
            <Content style={{ display: 'flex', flexDirection: 'column' }}>
                <main style={{ flex: '1 0 auto', padding: '24px' }}>
                    {children(viewMode)}
                </main>
            </Content>
            <Footer />
        </Layout>
    );
};

export default AppLayout;

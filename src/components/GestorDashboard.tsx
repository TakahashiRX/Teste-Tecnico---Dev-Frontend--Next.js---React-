"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Row, Col, Card, Statistic, Alert, Spin } from 'antd';
import { getChamados } from '@/api/chamados';
import { Chamado } from '@/types/chamados';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FrownOutlined, CheckCircleOutlined, SyncOutlined, IssuesCloseOutlined, ClockCircleOutlined } from '@ant-design/icons';

// Função para formatar milissegundos em uma string legível
const formatDuration = (ms: number) => {
    if (ms < 0) ms = 0;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
};

const GestorDashboard = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['allChamadosForDashboard'],
        queryFn: () => getChamados({ pageSize: 1200 }),
    });

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" description="Carregando métricas..." />
            </div>
        );
    }

    if (isError) {
        return <Alert message="Erro ao carregar o dashboard." type="error" showIcon />;
    }

    const chamados = data?.data || [];

    // --- Processamento de Dados ---
    const statusCounts = chamados.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {} as Record<Chamado['status'], number>);
    const areaCounts = chamados.reduce((acc, c) => { acc[c.area] = (acc[c.area] || 0) + 1; return acc; }, {} as Record<Chamado['area'], number>);
    const prioridadeCounts = chamados.reduce((acc, c) => { acc[c.prioridade] = (acc[c.prioridade] || 0) + 1; return acc; }, {} as Record<Chamado['prioridade'], number>);

    // Cálculo do tempo médio de abertura
    const openTickets = chamados.filter(c => c.status === 'Aberto' || c.status === 'Em andamento');
    const totalOpenTime = openTickets.reduce((acc, c) => acc + (new Date().getTime() - new Date(c.abertura).getTime()), 0);
    const averageOpenTime = openTickets.length > 0 ? totalOpenTime / openTickets.length : 0;

    // --- Dados para Gráficos ---
    const areaChartData = Object.keys(areaCounts).map(area => ({ name: area, 'Chamados': areaCounts[area as Chamado['area']] }));
    const prioridadeChartData = Object.keys(prioridadeCounts).map(p => ({ name: p, value: prioridadeCounts[p as Chamado['prioridade']] }));
    const PIE_COLORS = { 'Crítica': '#f5222d', 'Alta': '#faad14', 'Média': '#1890ff', 'Baixa': '#d9d9d9' };

    return (
        <Row gutter={[24, 24]}>
            {/* Cards de Métricas */}
            <Col xs={24} sm={12} md={8} lg={5}><Card><Statistic title="Abertos" value={statusCounts['Aberto'] || 0} prefix={<IssuesCloseOutlined />} styles={{ content: { color: '#1890ff' } }} /></Card></Col>
            <Col xs={24} sm={12} md={8} lg={5}><Card><Statistic title="Em Andamento" value={statusCounts['Em andamento'] || 0} prefix={<SyncOutlined spin />} styles={{ content: { color: '#faad14' } }} /></Card></Col>
            <Col xs={24} sm={12} md={8} lg={4}><Card><Statistic title="Resolvidos" value={statusCounts['Resolvido'] || 0} prefix={<CheckCircleOutlined />} styles={{ content: { color: '#52c41a' } }} /></Card></Col>
            <Col xs={24} sm={12} md={8} lg={4}><Card><Statistic title="Cancelados" value={statusCounts['Cancelado'] || 0} prefix={<FrownOutlined />} styles={{ content: { color: '#f5222d' } }} /></Card></Col>
            <Col xs={24} sm={24} md={16} lg={6}><Card><Statistic title="Tempo Médio Aberto" value={formatDuration(averageOpenTime)} prefix={<ClockCircleOutlined />} /></Card></Col>
            
            {/* Gráficos */}
            <Col xs={24} lg={12}>
                <Card title="Chamados por Área">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={areaChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Chamados" fill="#ec6725" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </Col>
            <Col xs={24} lg={12}>
                <Card title="Chamados por Prioridade">
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie data={prioridadeChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>
                                {prioridadeChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as keyof typeof PIE_COLORS]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </Col>
        </Row>
    );
};

export default GestorDashboard;

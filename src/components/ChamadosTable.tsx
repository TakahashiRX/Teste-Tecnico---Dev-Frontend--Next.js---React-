"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Input, Button, Space, Card, Alert, Drawer, Descriptions, Divider, Timeline, Grid } from 'antd';
import type { TableProps } from 'antd';
import { getChamados, GetChamadosParams } from '@/api/chamados';
import { Chamado } from '@/types/chamados';
import LoadingSkeleton from './LoadingSkeleton';
import StatusBadge from './StatusBadge';
import PriorityTag from './PriorityTag';
import NovoChamadoForm from './NovoChamadoForm';
import { ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Search } = Input;
const { useBreakpoint } = Grid;

const ChamadosTable = () => {
    const [params, setParams] = useState<GetChamadosParams>({
        page: 1,
        pageSize: 10,
    });
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [selectedChamado, setSelectedChamado] = useState<Chamado | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const screens = useBreakpoint(); // Hook para detectar o tamanho da tela

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['chamados', params],
        queryFn: () => getChamados(params),
        
    });

    const handleTableChange: TableProps<Chamado>['onChange'] = (pagination, filters, sorter) => {
        const newParams: GetChamadosParams = { ...params };
        newParams.page = pagination.current;
        newParams.pageSize = pagination.pageSize;
        if (filters.status) newParams.status = filters.status as string[];
        if (filters.prioridade) newParams.prioridade = filters.prioridade as string[];
        if (filters.area) newParams.area = filters.area as string[];
        if (sorter && 'field' in sorter && sorter.order) {
            newParams.sortBy = sorter.field as keyof Chamado;
            newParams.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
        } else {
            delete newParams.sortBy;
            delete newParams.sortOrder;
        }
        setParams(newParams);
    };

    const handleSearch = (value: string) => {
        setParams(prev => ({ ...prev, query: value, page: 1 }));
    };

    const showDrawer = (chamado: Chamado) => {
        setSelectedChamado(chamado);
        setIsDrawerVisible(true);
    };

    const closeDrawer = () => {
        setIsDrawerVisible(false);
        setSelectedChamado(null);
    };

    const columns: TableProps<Chamado>['columns'] = [
        { title: 'ID', dataIndex: 'id', sorter: true },
        { title: 'Título', dataIndex: 'titulo', sorter: true, ellipsis: true },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status: Chamado['status']) => <StatusBadge status={status} />,
            filters: [
                { text: 'Aberto', value: 'Aberto' },
                { text: 'Em andamento', value: 'Em andamento' },
                { text: 'Resolvido', value: 'Resolvido' },
                { text: 'Cancelado', value: 'Cancelado' },
            ],
        },
        {
            title: 'Prioridade',
            dataIndex: 'prioridade',
            render: (prioridade: Chamado['prioridade']) => <PriorityTag prioridade={prioridade} />,
            filters: [
                { text: 'Crítica', value: 'Crítica' },
                { text: 'Alta', value: 'Alta' },
                { text: 'Média', value: 'Média' },
                { text: 'Baixa', value: 'Baixa' },
            ],
        },
        {
            title: 'Área',
            dataIndex: 'area',
            sorter: true,
        },
        {
            title: 'Última Atualização',
            dataIndex: 'ultimaAtualizacao',
            render: (date: string) => new Date(date).toLocaleString('pt-BR'),
            sorter: true,
        },
    ];

    if (isLoading) return <LoadingSkeleton />;

    if (isError) {
        return (
            <Alert
                message="Erro ao carregar os dados"
                description={error.message || "Não foi possível buscar os chamados."}
                type="error"
                showIcon
                action={<Button type="primary" onClick={() => refetch()}>Tentar Novamente</Button>}
            />
        );
    }
    
    return (
        <>
            <Card>
                <Space orientation={screens.xs ? 'vertical' : 'horizontal'} style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                    <Search placeholder="Buscar por título, equipamento..." onSearch={handleSearch} style={{ width: screens.xs ? '100%' : 300 }} allowClear />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ width: screens.xs ? '100%' : 'auto' }}>
                        Novo Chamado
                    </Button>
                </Space>
                {/* 
                    Estratégia de Responsividade da Tabela:
                    Em telas pequenas, em vez de esconder colunas (o que pode remover informações
                    importantes para o técnico), ativamos o scroll horizontal. Isso garante que
                    todos os dados fiquem acessíveis, um padrão de UX comum e esperado para tabelas complexas.
                */}
                <Table
                    columns={columns}
                    dataSource={data?.data}
                    rowKey="id"
                    pagination={{
                        current: params.page,
                        pageSize: params.pageSize,
                        total: data?.total,
                        showSizeChanger: true,
                    }}
                    onChange={handleTableChange}
                    onRow={(record) => ({
                        onClick: () => showDrawer(record),
                    })}
                    rowClassName="cursor-pointer"
                    scroll={{ x: 'max-content' }}
                />
            </Card>

            <Drawer
                title={`Detalhes do Chamado #${selectedChamado?.id}`}
                size={!screens.lg ? '100%' : 720} // Ocupa 100% da tela em breakpoints menores que 'lg'
                onClose={closeDrawer}
                open={isDrawerVisible}
                destroyOnClose
            >
                {selectedChamado && (
                    <>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Título">{selectedChamado.titulo}</Descriptions.Item>
                            <Descriptions.Item label="Status"><StatusBadge status={selectedChamado.status} /></Descriptions.Item>
                            <Descriptions.Item label="Prioridade"><PriorityTag prioridade={selectedChamado.prioridade} /></Descriptions.Item>
                            <Descriptions.Item label="Área">{selectedChamado.area}</Descriptions.Item>
                            <Descriptions.Item label="Equipamento">{selectedChamado.equipamento}</Descriptions.Item>
                            <Descriptions.Item label="Instalação">{selectedChamado.instalacao}</Descriptions.Item>
                            <Descriptions.Item label="Responsável">{selectedChamado.responsavel || 'Não atribuído'}</Descriptions.Item>
                            <Descriptions.Item label="Abertura">{new Date(selectedChamado.abertura).toLocaleString('pt-BR')}</Descriptions.Item>
                            <Descriptions.Item label="Última Atualização">{new Date(selectedChamado.ultimaAtualizacao).toLocaleString('pt-BR')}</Descriptions.Item>
                            <Descriptions.Item label="Descrição">{selectedChamado.descricao}</Descriptions.Item>
                        </Descriptions>
                        
                        <Divider>Histórico do Chamado</Divider>

                        <Timeline
                            items={[
                                {
                                    color: 'green',
                                    content: `Chamado criado em ${new Date(selectedChamado.abertura).toLocaleString('pt-BR')}`,
                                },
                                {
                                    color: 'blue',
                                    content: 'Técnico Carlos Silva foi atribuído ao chamado.',
                                },
                                {
                                    icon: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
                                    content: `Última atualização recebida em ${new Date(selectedChamado.ultimaAtualizacao).toLocaleString('pt-BR')}`,
                                },
                                {
                                    color: 'gray',
                                    content: 'Aguardando diagnóstico do técnico...',
                                },
                            ]}
                        />
                    </>
                )}
            </Drawer>

            <NovoChamadoForm open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};


export default ChamadosTable;

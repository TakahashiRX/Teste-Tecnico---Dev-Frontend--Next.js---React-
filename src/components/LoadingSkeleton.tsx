import React from 'react';
import { Skeleton, Card, Space } from 'antd';

interface LoadingSkeletonProps {
    rows?: number;
}

/**
 * Um esqueleto de carregamento que simula a aparência da
 * tabela de chamados e seus controles.
 */
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 5 }) => {
    return (
        <Card>
            {/* Simula os controles de filtro e busca */}
            <Space style={{ marginBottom: 24, width: '100%', justifyContent: 'space-between' }}>
                <Skeleton.Input style={{ width: 300 }} active />
                <Space>
                    <Skeleton.Button active />
                    <Skeleton.Button active />
                </Space>
            </Space>

            {/* Simula as linhas da tabela */}
            <Skeleton active paragraph={{ rows: rows * 2, width: '100%' }} />

        </Card>
    );
};

export default LoadingSkeleton;

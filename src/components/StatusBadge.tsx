import React from 'react';
import { Badge } from 'antd';
import { ChamadoStatus } from '@/types/chamados';

interface StatusBadgeProps {
  status: ChamadoStatus;
}

// Mapeia nosso status para as cores/status predefinidos do Ant Design Badge
const statusMap: Record<ChamadoStatus, { status: 'processing' | 'warning' | 'success' | 'error', text: string }> = {
  'Aberto': { status: 'processing', text: 'Aberto' },
  'Em andamento': { status: 'warning', text: 'Em Andamento' },
  'Resolvido': { status: 'success', text: 'Resolvido' },
  'Cancelado': { status: 'error', text: 'Cancelado' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const badgeProps = statusMap[status] || { status: 'default', text: 'Desconhecido' };

  return <Badge status={badgeProps.status} text={badgeProps.text} />;
};

export default StatusBadge;

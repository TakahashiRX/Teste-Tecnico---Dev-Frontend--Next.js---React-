import React from 'react';
import { Tag } from 'antd';
import { 
  WarningOutlined, 
  ArrowUpOutlined, 
  ArrowRightOutlined, 
  ArrowDownOutlined 
} from '@ant-design/icons';
import { ChamadoPrioridade } from '@/types/chamados';

interface PriorityTagProps {
  prioridade: ChamadoPrioridade;
}

const priorityMap: Record<ChamadoPrioridade, { color: string; icon: React.ReactNode; text: string }> = {
  'Crítica': { color: 'red', icon: <WarningOutlined />, text: 'Crítica' },
  'Alta': { color: 'orange', icon: <ArrowUpOutlined />, text: 'Alta' },
  'Média': { color: 'blue', icon: <ArrowRightOutlined />, text: 'Média' },
  'Baixa': { color: 'gray', icon: <ArrowDownOutlined />, text: 'Baixa' },
};

const PriorityTag: React.FC<PriorityTagProps> = ({ prioridade }) => {
  const tagProps = priorityMap[prioridade] || { color: 'default', icon: null, text: 'Desconhecida' };

  return (
    <Tag color={tagProps.color} icon={tagProps.icon}>
      {tagProps.text}
    </Tag>
  );
};

export default PriorityTag;

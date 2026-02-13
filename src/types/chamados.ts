export type ChamadoStatus = "Aberto" | "Em andamento" | "Resolvido" | "Cancelado";
export type ChamadoPrioridade = "Crítica" | "Alta" | "Média" | "Baixa";
export type ChamadoArea = "Refrigeração" | "Energia" | "Ar-condicionado" | "Água";

export interface Chamado {
  id: string;
  titulo: string;
  status: ChamadoStatus;
  prioridade: ChamadoPrioridade;
  area: ChamadoArea;
  equipamento: string;
  instalacao: string;
  abertura: string; // ISO 8601 date string
  ultimaAtualizacao: string; // ISO 8601 date string
  descricao: string;
  responsavel?: string; // Optional
}

import { Chamado } from '@/types/chamados';
import { generateMockChamados } from '@/utils/generateMocks';

// Gera a base de dados em memória uma única vez, simulando um banco de dados.
let chamados: Chamado[] = generateMockChamados(1200);

// Simula a latência da rede para que a UI de loading apareça.
const NETWORK_LATENCY = 500;

export interface GetChamadosParams {
    page?: number;
    pageSize?: number;
    query?: string;
    status?: string[];
    prioridade?: string[];
    area?: string[];
    sortBy?: keyof Chamado;
    sortOrder?: 'asc' | 'desc';
}

export interface GetChamadosResponse {
    data: Chamado[];
    total: number;
}

/**
 * Simula uma chamada de API para buscar chamados.
 * POR QUÊ: Para o teste técnico, não temos um backend real. Esta função simula
 * o comportamento de um endpoint de API, incluindo filtros, ordenação e paginação.
 * O QUÊ: Ela recebe os parâmetros de busca, aplica a lógica de filtro/ordenação
 * sobre o array em memória e retorna os dados paginados, imitando uma resposta de API.
 */
export const getChamados = (params: GetChamadosParams): Promise<GetChamadosResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filteredData = [...chamados];

            // 1. Simulação de Filtragem "server-side"
            if (params.query) {
                const lowerCaseQuery = params.query.toLowerCase();
                filteredData = filteredData.filter(c => 
                    c.titulo.toLowerCase().includes(lowerCaseQuery) ||
                    c.descricao.toLowerCase().includes(lowerCaseQuery) ||
                    c.equipamento.toLowerCase().includes(lowerCaseQuery)
                );
            }
            if (params.status?.length) {
                filteredData = filteredData.filter(c => params.status!.includes(c.status));
            }
            if (params.prioridade?.length) {
                filteredData = filteredData.filter(c => params.prioridade!.includes(c.prioridade));
            }
            if (params.area?.length) {
                filteredData = filteredData.filter(c => params.area!.includes(c.area));
            }

            // 2. Simulação de Ordenação "server-side"
            if (params.sortBy && params.sortOrder) {
                filteredData.sort((a, b) => {
                    const aValue = a[params.sortBy!];
                    const bValue = b[params.sortBy!];
                    
                    if (aValue === undefined || aValue === null) return 1;
                    if (bValue === undefined || bValue === null) return -1;

                    if (aValue < bValue) return params.sortOrder === 'asc' ? -1 : 1;
                    if (aValue > bValue) return params.sortOrder === 'asc' ? 1 : -1;
                    return 0;
                });
            }

            const total = filteredData.length;

            // 3. Simulação de Paginação "server-side"
            const page = params.page || 1;
            const pageSize = params.pageSize || 10;
            const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

            resolve({
                data: paginatedData,
                total: total,
            });
        }, NETWORK_LATENCY);
    });
};

/**
 * Simula a criação de um novo chamado.
 * O QUÊ: Adiciona um novo chamado ao início do array em memória para que
 * ele apareça imediatamente na tabela após a criação.
 */
export const createChamado = (novoChamadoData: Omit<Chamado, 'id' | 'abertura' | 'ultimaAtualizacao'>): Promise<Chamado> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const now = new Date().toISOString();
            const novoChamado: Chamado = {
                ...novoChamadoData,
                id: (Math.max(...chamados.map(c => parseInt(c.id))) + 1).toString(),
                abertura: now,
                ultimaAtualizacao: now,
            };
            
            chamados.unshift(novoChamado);
            
            resolve(novoChamado);
        }, NETWORK_LATENCY);
    });
};


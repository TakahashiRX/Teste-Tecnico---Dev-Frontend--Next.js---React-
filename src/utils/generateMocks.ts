import { faker } from '@faker-js/faker';
import { Chamado, ChamadoStatus, ChamadoPrioridade, ChamadoArea } from '@/types/chamados';
import baseChamados from '@/mocks/chamados.json';

type BaseChamadoJson = Omit<Chamado, 'id' | 'responsavel'> & {
    id: number | string;
    responsavel?: string | null;
};

// Normaliza o formato do JSON para o contrato da interface Chamado
const typedBaseChamados: Chamado[] = (baseChamados as BaseChamadoJson[]).map((chamado) => ({
    ...chamado,
    id: String(chamado.id),
    responsavel: chamado.responsavel ?? undefined,
}));

const statusOptions: ChamadoStatus[] = ["Aberto", "Em andamento", "Resolvido", "Cancelado"];
const priorityOptions: ChamadoPrioridade[] = ["Crítica", "Alta", "Média", "Baixa"];
const areaOptions: ChamadoArea[] = ["Refrigeração", "Energia", "Ar-condicionado", "Água"];

const generateRandomChamado = (id: number): Chamado => {
    const creationDate = faker.date.recent({ days: 30 });
    const updateDate = faker.date.between({ from: creationDate, to: new Date() });

    return {
        id: (1013 + id).toString(), // Inicia IDs após os mocks base
        titulo: faker.lorem.sentence(5),
        status: faker.helpers.arrayElement(statusOptions),
        prioridade: faker.helpers.arrayElement(priorityOptions),
        area: faker.helpers.arrayElement(areaOptions),
        equipamento: `${faker.commerce.productName()} ${faker.string.alphanumeric(5)}`,
        instalacao: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
        abertura: creationDate.toISOString(),
        ultimaAtualizacao: updateDate.toISOString(),
        descricao: faker.lorem.paragraph(),
        responsavel: faker.person.fullName(),
    };
};

export const generateMockChamados = (total = 1200): Chamado[] => {
    if (typedBaseChamados.length >= total) {
        return typedBaseChamados.slice(0, total);
    }

    const newChamados: Chamado[] = [];
    const needed = total - typedBaseChamados.length;

    for (let i = 0; i < needed; i++) {
        newChamados.push(generateRandomChamado(i));
    }

    return [...typedBaseChamados, ...newChamados];
};

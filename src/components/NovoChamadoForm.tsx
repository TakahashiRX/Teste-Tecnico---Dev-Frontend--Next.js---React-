"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Form, Input, Select, Button, App, Grid } from 'antd';
import { createChamado } from '@/api/chamados';
import { ChamadoArea, ChamadoPrioridade } from '@/types/chamados';

const areaOptions: { value: ChamadoArea; label: string }[] = [
    { value: 'Refrigeração', label: 'Refrigeração' },
    { value: 'Energia', label: 'Energia' },
    { value: 'Ar-condicionado', label: 'Ar-condicionado' },
    { value: 'Água', label: 'Água' },
];

const prioridadeOptions: { value: ChamadoPrioridade; label: string }[] = [
    { value: 'Crítica', label: 'Crítica' },
    { value: 'Alta', label: 'Alta' },
    { value: 'Média', label: 'Média' },
    { value: 'Baixa', label: 'Baixa' },
];

/**
 * Schema de Validação com Zod.
 * POR QUÊ: Utilizar um schema para validação garante uma única fonte da verdade
 * para o formato dos dados, desacoplando as regras de negócio da UI.
 * O QUÊ: Define que campos são obrigatórios, seus tipos e regras mínimas
 * de tamanho, com mensagens de erro personalizadas em português.
 */
const chamadoSchema = z.object({
    titulo: z.string().min(5, 'O título deve ter no mínimo 5 caracteres.'),
    area: z.enum(['Refrigeração', 'Energia', 'Ar-condicionado', 'Água'], {
        errorMap: () => ({ message: 'Selecione uma área válida.' }),
    }),
    prioridade: z.enum(['Crítica', 'Alta', 'Média', 'Baixa'], {
        errorMap: () => ({ message: 'Selecione uma prioridade válida.' }),
    }),
    equipamento: z.string().min(3, 'O nome do equipamento é obrigatório.'),
    instalacao: z.string().min(3, 'O nome da instalação é obrigatório.'),
    descricao: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres.'),
});

type ChamadoFormData = z.infer<typeof chamadoSchema>;

interface NovoChamadoFormProps {
    open: boolean;
    onClose: () => void;
}

const { useBreakpoint } = Grid;

const NovoChamadoForm: React.FC<NovoChamadoFormProps> = ({ open, onClose }) => {
    const queryClient = useQueryClient();
    const { message } = App.useApp();
    const screens = useBreakpoint();
    const { control, handleSubmit, formState: { errors }, reset } = useForm<ChamadoFormData>({
        resolver: zodResolver(chamadoSchema),
    });

    /**
     * React Query Mutation para Criar Chamado.
     * POR QUÊ: useMutation simplifica o ciclo de vida de uma operação de escrita (POST/PUT),
     * tratando estados de loading, success e error de forma declarativa.
     * O QUÊ: Ao submeter, ele chama a API `createChamado`. Em caso de sucesso,
     * exibe uma notificação, invalida a query 'chamados' (forçando a tabela a se
     * atualizar automaticamente) e fecha o modal.
     */
    const { mutate, isPending } = useMutation({
        mutationFn: createChamado,
        onSuccess: () => {
            message.success('Chamado criado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['chamados'] });
            onClose();
        },
        onError: () => {
            message.error('Falha ao criar o chamado. Tente novamente.');
        },
    });

    useEffect(() => {
        if (!open) reset();
    }, [open, reset]);

    const onSubmit = (data: ChamadoFormData) => {
        mutate({ ...data, status: 'Aberto' });
    };

    return (
        <Modal
            title="Criar Novo Chamado"
            open={open}
            onCancel={onClose}
            footer={
                <div 
                    style={{ 
                        display: 'flex', 
                        flexDirection: screens.xs ? 'column-reverse' : 'row',
                        gap: '8px',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button key="back" onClick={onClose} disabled={isPending} style={{ width: screens.xs ? '100%' : 'auto' }}>
                        Cancelar
                    </Button>
                    <Button key="submit" type="primary" loading={isPending} onClick={handleSubmit(onSubmit)} style={{ width: screens.xs ? '100%' : 'auto' }}>
                        Criar Chamado
                    </Button>
                </div>
            }
        >
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item label="Título" required validateStatus={errors.titulo ? 'error' : ''} help={errors.titulo?.message}>
                    <Controller name="titulo" control={control} render={({ field }) => <Input {...field} />} />
                </Form.Item>

                <Form.Item label="Área" required validateStatus={errors.area ? 'error' : ''} help={errors.area?.message}>
                    <Controller name="area" control={control} render={({ field }) => <Select {...field} options={areaOptions} />} />
                </Form.Item>

                <Form.Item label="Prioridade" required validateStatus={errors.prioridade ? 'error' : ''} help={errors.prioridade?.message}>
                    <Controller name="prioridade" control={control} render={({ field }) => <Select {...field} options={prioridadeOptions} />} />
                </Form.Item>

                <Form.Item label="Equipamento" required validateStatus={errors.equipamento ? 'error' : ''} help={errors.equipamento?.message}>
                    <Controller name="equipamento" control={control} render={({ field }) => <Input {...field} />} />
                </Form.Item>

                <Form.Item label="Instalação" required validateStatus={errors.instalacao ? 'error' : ''} help={errors.instalacao?.message}>
                    <Controller name="instalacao" control={control} render={({ field }) => <Input {...field} placeholder="Ex: Loja Centro - SP" />} />
                </Form.Item>

                <Form.Item label="Descrição" required validateStatus={errors.descricao ? 'error' : ''} help={errors.descricao?.message}>
                    <Controller name="descricao" control={control} render={({ field }) => <Input.TextArea {...field} rows={4} />} />
                </Form.Item>
            </Form>
        </Modal>
    );
};


export default NovoChamadoForm;

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from './StatusBadge';
import { ChamadoStatus } from '@/types/chamados';

describe('StatusBadge Component', () => {
    it('should render "Aberto" status correctly', () => {
        render(<StatusBadge status="Aberto" />);
        expect(screen.getByText('Aberto')).toBeInTheDocument();
    });

    it('should render "Em Andamento" status correctly', () => {
        render(<StatusBadge status="Em andamento" />);
        expect(screen.getByText('Em Andamento')).toBeInTheDocument();
    });

    it('should render "Resolvido" status correctly', () => {
        render(<StatusBadge status="Resolvido" />);
        expect(screen.getByText('Resolvido')).toBeInTheDocument();
    });

    it('should render "Cancelado" status correctly', () => {
        render(<StatusBadge status="Cancelado" />);
        expect(screen.getByText('Cancelado')).toBeInTheDocument();
    });
});

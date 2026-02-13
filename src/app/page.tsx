"use client";

import AppLayout from "@/components/layout/AppLayout";
import ChamadosTable from "@/components/ChamadosTable";
import GestorDashboard from "@/components/GestorDashboard";
import { Typography } from "antd";

const { Title } = Typography;

/**
 * A página Home agora atua como um container de conteúdo,
 * delegando toda a estrutura de layout para o AppLayout.
 * 
 * Ela utiliza o padrão de "render prop" do AppLayout para
 * renderizar o conteúdo correto (Técnico ou Gestor)
 * com base no estado de visão gerenciado pelo layout.
 */
export default function Home() {
  return (
    <AppLayout>
      {(viewMode) => (
        <>
          <Title level={1} style={{ marginBottom: '24px' }}>
            {viewMode === 'Técnico' ? 'Visão do Técnico' : 'Dashboard do Gestor'}
          </Title>
          {viewMode === 'Técnico' && <ChamadosTable />}
          {viewMode === 'Gestor' && <GestorDashboard />}
        </>
      )}
    </AppLayout>
  );
}

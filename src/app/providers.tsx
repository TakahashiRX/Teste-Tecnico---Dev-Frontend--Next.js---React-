"use client";

import React from "react";
import { ConfigProvider, App as AntdApp } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleProvider } from "@ant-design/cssinjs";

// Cria uma instância única do QueryClient.
const queryClient = new QueryClient();

const themeConfig = {
  token: {
    // Cor Primária
    colorPrimary: "#ec6725",
  },
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 
        O StyleProvider é necessário para o Next.js App Router.
        Veja: https://ant.design/docs/react/use-in-next
      */}
      <StyleProvider hashPriority="high">
        <ConfigProvider theme={themeConfig}>
          {/* 
            O AntdApp é um componente wrapper que nos permite usar
            componentes do AntD que dependem de contexto, como message e notification.
          */}
          <AntdApp>{children}</AntdApp>
        </ConfigProvider>
      </StyleProvider>
    </QueryClientProvider>
  );
};

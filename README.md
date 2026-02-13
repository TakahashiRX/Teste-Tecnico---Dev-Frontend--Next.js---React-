This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Respostas conceituais

### Cache e mutação (React Query)

Para refletir a criação de um novo chamado imediatamente, a estratégia mais robusta e simples com React Query é a **invalidação seletiva de queries**. Após a mutação `createChamado` obter sucesso, eu invocaria `queryClient.invalidateQueries({ queryKey: ['chamados'] })`. Isso sinaliza ao React Query que os dados daquela chave estão obsoletos, forçando um refetch automático apenas das queries ativas que a utilizam. A grande vantagem é que ele refaz a busca com os mesmos filtros já aplicados pelo usuário (status, área, etc.), garantindo que a lista seja atualizada de forma consistente e eficiente, sem a necessidade de manipular o cache manualmente. Para uma UI ainda mais instantânea, poderia ser implementado um *optimistic update*, mas a invalidação já resolve o requisito principal com menor complexidade.

### Performance em Tabelas (Virtualização)

Com 5.000 linhas em um celular, a performance é crítica. Minha abordagem, em ordem de prioridade, seria:
1.  **Virtualização (ou Windowing):** É a solução mais impactante. Em vez de renderizar 5.000 nós no DOM, apenas os itens visíveis na tela (e um pequeno buffer) são renderizados. Bibliotecas como `TanStack Virtual` ou `react-window` são ideais para isso, reduzindo o consumo de memória e o tempo de renderização de segundos para milissegundos.
2.  **Paginação no Servidor (Server-Side Pagination):** Em vez de buscar todos os 5.000 registros de uma vez, a API deve paginar os resultados. O front-end solicitaria apenas os dados necessários para a página atual, diminuindo drasticamente o tempo de carregamento inicial.
3.  **Redução de Colunas em Telas Pequenas:** Esconder colunas menos importantes em breakpoints mobile com CSS (`@media`). Menos colunas significam menos complexidade por linha e uma interface mais limpa.
4.  **Debounce na Filtragem:** Evitar que a filtragem seja executada a cada tecla pressionada, aplicando um *debounce* de ~300ms.

### Arquitetura de Componentes (Composição)

Para que o `<StatusBadge />` seja reutilizável sem sobrecarga de props, eu o projetaria usando o princípio de **composição**, em vez de condicionais internas. O componente base faria uma única coisa: exibir o badge visualmente com base na prop `status`.
- **Badge Puro:** `<StatusBadge status="Aberto" />`
- **Com Tooltip:** O consumidor do componente o envolveria com um componente de tooltip. Ex: `<Tooltip title="Status detalhado"><StatusBadge status="Aberto" /></Tooltip>`.
- **Com Dropdown:** Da mesma forma, seria envolvido por um componente de dropdown. Ex: `<Dropdown menu={items}><StatusBadge status="Aberto" /></Dropdown>`.

Essa abordagem, conhecida como "Compound Components" ou simplesmente composição, mantém o `StatusBadge` simples, previsível e focado. A responsabilidade por funcionalidades extras (tooltip, dropdown) fica com o contexto que o utiliza, evitando a criação de um componente monolítico e complexo.
# Projeto Next.js

Este é um projeto desenvolvido com [Next.js](https://nextjs.org), inicializado utilizando [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## 🚀 Como começar

Primeiro, execute o servidor de desenvolvimento:

npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev

Abra http://localhost:3000 no navegador para visualizar o resultado.

Você pode começar a editar a aplicação modificando o arquivo:

app/page.tsx

A página será atualizada automaticamente conforme você salva as alterações.

---

## 🔤 Fontes

Este projeto utiliza next/font para otimização automática de fontes e melhor performance de carregamento.

---

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

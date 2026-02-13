describe('Fluxo de Chamados', () => {
    it('deve abrir o modal de novo chamado ao clicar no botão', () => {
      // Visita a página inicial
      cy.visit('/');
  
      // Encontra o botão "Novo Chamado" e clica nele
      // Usamos um seletor que busca pelo texto para ser mais resiliente
      cy.contains('button', 'Novo Chamado').click();
  
      // Verifica se o modal apareceu
      // Procuramos pelo título do modal para confirmar sua visibilidade
      cy.contains('h2', 'Criar Novo Chamado').should('be.visible');
    });
  });
  
# :open_book: Tell Us Your Story (TUYS)

TUYS é uma rede social para o compartilhamento de histórias fictícias, direcionado à pessoas que gostem de ler e/ou escrever histórias que explorem sua criatividade.

<div align=center>
 <img align=top src="https://user-images.githubusercontent.com/97851922/218341002-519a7d44-e50b-4279-945a-4241ffc481fa.gif" />
 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
 <img align=top src="https://user-images.githubusercontent.com/97851922/218341013-cefbeabb-c70e-469e-92f8-926c362daa00.gif" />
</div>

<br />

## :hammer: Funcionalidades

- Layout responsivo
- Temas
- Ranqueamento de usuários
- Login
- Cadastro
- Ler e publicar histórias dentro de canais
- Curtir/Comentar/Denunciar/Editar/Apagar histórias
- Ranking semanal das histórias mais curtidas
- Página de usuário
- Seguir/Parar de seguir usuário
- Notificações
- Limitações para usuários banidos
- Para usuários de rank Admin: desbanir usuários, criar/editar/apagar canais de histórias
- Logout

<br />

## :ballot_box_with_check: Próximos passos

- [ ] Refatorar o frontend
  - [ ] Reestruturar os componentes
  - [ ] Alterar tipagens nos protocolos
  - [ ] Trocar as tags utilizadas para tags semânticas
  - [ ] Remover as configurações do firebase
- [ ] Refatorar o backend
  - [ ] Alterar os retornos das rotas
- [ ] Remover os checkpoints desnecessários
- [ ] Melhorar a acessibilidade
- [ ] Corrigir bugs
  - [ ] Fechar input de pesquisa ao clicar em qualquer outro lugar
  - [ ] Fechar dialogs ao clicar em qualquer outro lugar
  - [ ] Redirecionar para as configurações de perfil na raiz das configurações
- [ ] Corrigir layout
  - [ ] Alterar logo
  - [ ] Tela de notificações para desktop
  - [ ] Responsividade dos cards das histórias
  - [ ] Responsividade da página do usuário
  - [ ] Responsividade dos botões, formulários e dialogs
  - [ ] Opções de tema clicáveis
  - [ ] Indicação de rank do usuário no avatar
  - [ ] Tela de not found
- [ ] Adicionar novas feats
  - [ ] Filtrar notificações
  - [ ] Fazer upload de avatar
  - [ ] Permissões de usuário
  - [ ] Perfil sysadmin
  - [ ] Banimento permanente de usuários
  - [ ] Tela de erro genérico
  - [ ] Edição de dados do usuário: permitir a troca de email
  - [ ] Edição de dados do usuário: permitir a troca de senha
  - [ ] Mensagem de erro ao logar com Google se não tiver as configurações do firebase
- [ ] Adicionar testes no frontend
- [ ] Adicionar testes unitários no backend
- [ ] Atualizar documentações

<br />

## :hammer_and_wrench: Abrir e rodar o projeto

**Atenção:** para rodar o projeto é preciso ter o [Docker](https://docs.docker.com/engine/install/) e o [Docker Compose](https://docs.docker.com/compose/install/) instalado na sua máquina.

1. Clone esse repositório:

   > ```bash
   > git clone https://github.com/anatfernandes/tuys.git
   > ```

<br />

2. Inicie o projeto:

   > ```bash
   > docker-compose up --build
   > ```

3. Acesse http://localhost no seu navegador e aproveite <3

<br />

---

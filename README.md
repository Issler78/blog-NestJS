<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# RealWorld API — NestJS

Implementação completa da **RealWorld Conduit API** utilizando **NestJS**, baseada na documentação oficial:

👉 [https://realworld-docs.netlify.app/implementation-creation/introduction/](https://realworld-docs.netlify.app/implementation-creation/introduction/)

Este projeto tem como objetivo **estudos com NestJS**, demonstrando a implementação de uma API REST completa, seguindo boas práticas de arquitetura, organização de código, tipagem forte com TypeScript e uso de ORM.

> 📚 **Observação importante**: este projeto foi desenvolvido com foco educacional. Grande parte da implementação foi realizada acompanhando e adaptando conteúdos de **vídeos do YouTube**, especialmente para compreender decisões arquiteturais, padrões do NestJS e a aplicação correta da documentação da API. Todo o código foi digitado, adaptado e entendido durante o processo, servindo como aprendizado prático.

---

## 🚀 Tecnologias Utilizadas

* **NestJS**
* **TypeScript**
* **TypeORM**
* **PostgreSQL**
* **JWT** para autenticação
* **bcrypt** para hash de senhas

---

## 📌 Funcionalidades Implementadas

### 👤 Usuários

* Registro de usuário
* Login
* Atualização de dados do usuário autenticado
* Autenticação via JWT

### 👥 Perfis

* Visualizar perfil de um usuário
* Seguir usuário
* Deixar de seguir usuário

### 📝 Artigos

* Criar artigo
* Atualizar artigo
* Deletar artigo
* Listar artigos (com opção de definir limite de artigos listados)
* Favoritar e desfavoritar artigos
* Filtrar artigos por:

  * autor
  * tag
  * artigos favoritados por usuário
* Feed personalizado (artigos de usuários seguidos)

### 💬 Comentários

* Adicionar comentário em um artigo
* Listar comentários de um artigo
* Deletar comentário

### 🏷️ Tags

* Listar todas as tags disponíveis

---

## 🗂️ Estrutura do Projeto

```bash
src/
├── article/
│ ├── dto/
│ ├── types/
│ │ ├── article.type.ts
│ │ ├── articleResponse.interface.ts
│ │ └── articlesResponse.interface.ts
│ ├── article.controller.ts
│ ├── article.entity.ts
│ ├── article.module.ts
│ └── article.service.ts
├── comment/
├── profile/
├── tag/
├── migrations/
├── types/
├── user/
│ ├── decorators/
│ ├── dto/
│ ├── guards/
│ ├── middlewares/
│ ├── types/
│ ├── user.controller.ts
│ ├── user.entity.ts
│ ├── user.module.ts
│ └── user.service.ts
├── app.controller.ts
├── app.module.ts
└── app.service.ts
```

---

## 🔐 Autenticação

A autenticação é feita utilizando **JWT**.

* O token deve ser enviado no header:

```http
Authorization: Token <jwt_token>
```

Rotas públicas e protegidas seguem exatamente a documentação do RealWorld.

---

## ⚙️ Configuração do Ambiente

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/Issler78/blog-NestJS.git
```

### 2️⃣ Instalar dependências

```bash
npm install
```

### 3️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DATABASE=

# SECRET JWT
JWT_SECRET=
```

> Ajuste os valores conforme seu ambiente.

---

## ▶️ Executando o Projeto

```bash
# desenvolvimento
npm run start:dev

# produção
npm run build
npm run start:prod
```

A API ficará disponível em:

```
http://localhost:3000
```

---

## 📖 Documentação da API

A API segue **100%** o contrato definido pela RealWorld.

Você pode testar utilizando:

* Postman
* Insomnia

---

## 👨‍💻 Autor

**Matheus Issler**
Projeto desenvolvido com fins educacionais.

---

## Licença

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

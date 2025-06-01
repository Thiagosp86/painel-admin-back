# Backend Auth - NestJS + Prisma + JWT

Este repositório contém o backend da aplicação de autenticação com JWT usando NestJS, Prisma e PostgreSQL.

---

## 📁 Estrutura do Projeto

- `src/`
  - `auth/` — módulo de autenticação (controller, service, module)
  - `prisma/` — PrismaService para acesso ao banco
  - `main.ts` — ponto de entrada da aplicação

---

## 🚀 Setup Inicial

1. Clone o repositório

2. Instale as dependências

```bash
npm install
```

3. Configure a conexão com o banco no arquivo `.env`

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
```

4. Execute a migração inicial e seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

---

## 📜 Principais Funcionalidades

### 1. Autenticação JWT

- Usuário faz login com email e senha
- Backend valida credenciais
- Gera e retorna token JWT com payload (id, email, name)

### 2. Proteção de Rotas

- Endpoint `/auth/profile` protegido com JwtGuard
- Retorna os dados do usuário logado

### 3. CORS

- Liberado para `http://localhost:5173` (frontend)

### 4. Seed de Usuários

- Cria 3 usuários padrão para teste com senha `thiago`

---

## 📋 Comandos úteis

- Rodar aplicação:

```bash
npm run start:dev
```

- Gerar migração Prisma:

```bash
npx prisma migrate dev --name <nome>
```

- Seed banco:

```bash
npx prisma db seed
```

---

## 📄 Código Importante

### PrismaService (src/prisma/prisma.service.ts)

```ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {}
```

### AuthService login (src/auth/auth.service.ts)

```ts
async login(email: string, password: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    throw new UnauthorizedException('Credenciais inválidas');
  }
  const payload = { sub: user.id, email: user.email, name: user.name };
  const token = this.jwtService.sign(payload);
  return {
    access_token: token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}
```

---

## 🛠️ Tecnologias

- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)

---

Se quiser, posso gerar o arquivo para você baixar também! Só avisar.

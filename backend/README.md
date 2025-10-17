# Backend Monolito - Sistema de Votação Eletrônica

Este é o backend monolito unificado que combina as funcionalidades dos microsserviços de identidade e urna, incluindo a biblioteca de banco de dados.

## Funcionalidades

### Identidade
- Validação de identidade do eleitor
- Geração de credenciais para votação

### Urna
- Listagem de chapas por eleição
- Confirmação e registro de votos
- Validação de credenciais

### Database
- Serviço Prisma para acesso ao banco de dados
- Schema do banco de dados PostgreSQL

## Estrutura

```
backend/
├── src/
│   ├── controllers/
│   │   ├── identidade.controller.ts
│   │   └── urna.controller.ts
│   ├── services/
│   │   ├── identidade.service.ts
│   │   └── urna.service.ts
│   ├── models/
│   │   └── voto.dto.ts
│   ├── repositories/
│   │   └── urna.repository.ts
│   ├── app.module.ts
│   └── main.ts
├── database/
│   ├── src/
│   │   └── prisma.service.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

## Endpoints

### Identidade
- `POST /identidade/validar` - Valida identidade do eleitor

### Urna
- `GET /urna/chapas?eleicaoId={id}` - Lista chapas de uma eleição
- `POST /urna/confirmar` - Confirma e registra voto

## Execução

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run start:dev

# Executar em produção
npm run start
```

## Docker

```bash
# Construir e executar com docker-compose
docker-compose up --build
```

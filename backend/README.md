# Backend Monolito - Sistema de Votação Eletrônica (TCC)

Backend completo implementando todos os requisitos funcionais (RF01-RF15) e regras de negócio (RN01-RN13) para sistema de votação eletrônica.

## Funcionalidades Implementadas

### Administrador (RF01-RF04)
- Autenticação na plataforma
- Criação de eleições e chapas
- Importação de lista de eleitores
- Ativação/encerramento de eleições
- Visualização de resultados consolidados

### Mesário (RF05-RF09)
- Autenticação na plataforma
- Busca de eleitor por matrícula
- Exibição de status do eleitor
- Habilitação de eleitor apto
- Geração de credencial de voto

### Urna (RF10-RF15)
- Validação de credencial de voto
- Exibição de opções de voto
- Tela de confirmação
- Registro anônimo de voto
- Invalidação de credencial após uso

## Regras de Negócio Implementadas

### RN01: Gestão Exclusiva do Administrador
- Apenas usuários autenticados como Administrador podem criar/gerenciar eleições

### RN02: Eleição Completa
- Eleição deve ter: nome, descrição, chapas e lista de eleitores

### RN03: Eleição Ativa para Votação
- Votação só permitida quando `eleicao.ativa = true`

### RN04: Resultados Após Encerramento
- Resultados só visíveis quando `eleicao.status = "Encerrada"`

### RN05: Habilitação Única
- Apenas eleitores da lista oficial podem ser habilitados

### RN06: Voto Único
- Sistema impede votos duplicados através do status `jaVotou`

### RN07: Status Irreversível
- Status "Já Votou" não pode ser alterado

### RN08: Habilitação Obrigatória
- Eleitor deve ser habilitado por mesário antes de votar

### RN09: Credencial de Uso Único
- Cada habilitação gera credencial única

### RN10: Anonimato na Urna
- Urna não armazena dados pessoais do eleitor

### RN11: Invalidação Permanente
- Credencial marcada como usada após voto

### RN12: Dois Níveis de Acesso
- **Administrador**: Gestão completa do sistema
- **Mesário**: Habilitação de eleitores apenas

### RN13: Arquitetura de Anonimato
- Separação entre identidade (mesário) e voto (urna)

## Endpoints da API

### Administrador
- `POST /admin/login` - Autenticação do administrador
- `POST /admin/eleicoes` - Criar nova eleição
- `POST /admin/chapas` - Criar nova chapa
- `POST /admin/eleitores/importar` - Importar lista de eleitores
- `POST /admin/eleicoes/:id/ativar` - Ativar eleição para votação
- `POST /admin/eleicoes/:id/encerrar` - Encerrar eleição
- `GET /admin/eleicoes/:id/resultado` - Visualizar resultado da eleição

### Mesário
- `POST /mesario/login` - Autenticação do mesário
- `GET /mesario/eleitor/:matricula` - Buscar eleitor por matrícula
- `POST /mesario/habilitar` - Habilitar eleitor para votar

### Urna
- `POST /urna/validar-credencial` - Validar credencial de voto
- `GET /urna/chapas?eleicaoId={id}` - Listar chapas da eleição
- `POST /urna/confirmar` - Confirmar e registrar voto

### Identidade (Legado)
- `POST /identidade/validar` - Validação de identidade

## Estrutura

```
backend/
├── src/
│   ├── controllers/     # Controladores REST
│   │   ├── admin.controller.ts
│   │   ├── mesario.controller.ts
│   │   ├── urna.controller.ts
│   │   └── identidade.controller.ts
│   ├── services/        # Lógica de negócio
│   │   ├── admin.service.ts
│   │   ├── mesario.service.ts
│   │   ├── urna.service.ts
│   │   └── identidade.service.ts
│   ├── repositories/    # Acesso ao banco
│   │   ├── admin.repository.ts
│   │   ├── mesario.repository.ts
│   │   └── urna.repository.ts
│   ├── models/          # DTOs
│   │   ├── admin.dto.ts
│   │   ├── mesario.dto.ts
│   │   └── voto.dto.ts
│   └── app.module.ts    # Configuração principal
├── database/            # Prisma e schema do banco
└── package.json         # Dependências
```

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
# Construir e executar
docker-compose up --build
```

## Requisitos Funcionais Implementados

- ✅ RF01: Autenticação do administrador
- ✅ RF02: Criação de eleições e chapas
- ✅ RF03: Importação de eleitores
- ✅ RF04: Visualização de resultados
- ✅ RF05: Autenticação do mesário
- ✅ RF06: Busca de eleitor por matrícula
- ✅ RF07: Exibição de status do eleitor
- ✅ RF08: Habilitação de eleitor
- ✅ RF09: Geração de credencial única
- ✅ RF10: Solicitação de credencial na urna
- ✅ RF11: Validação de credencial
- ✅ RF12: Exibição de opções de voto
- ✅ RF13: Tela de confirmação
- ✅ RF14: Registro anônimo de voto
- ✅ RF15: Invalidação de credencial

## Regras de Negócio Implementadas

- ✅ RN01: Gestão exclusiva do administrador
- ✅ RN02: Eleição completa com todos os elementos
- ✅ RN03: Votação apenas em eleições ativas
- ✅ RN04: Resultados após encerramento
- ✅ RN05: Habilitação apenas de eleitores oficiais
- ✅ RN06: Voto único por eleitor
- ✅ RN07: Status irreversível após votação
- ✅ RN08: Habilitação obrigatória por mesário
- ✅ RN09: Credencial de uso único
- ✅ RN10: Anonimato na urna eletrônica
- ✅ RN11: Invalidação permanente de credenciais
- ✅ RN12: Dois níveis de acesso
- ✅ RN13: Arquitetura de anonimato

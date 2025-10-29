-- CreateTable
CREATE TABLE "Eleicao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Criada',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Eleicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "eleicaoId" TEXT NOT NULL,

    CONSTRAINT "Chapa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Eleitor" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "eleicaoId" TEXT NOT NULL,
    "jaVotou" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Eleitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credencial" (
    "id" TEXT NOT NULL,
    "eleitorId" TEXT NOT NULL,
    "eleicaoId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "usada" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Credencial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voto" (
    "id" TEXT NOT NULL,
    "eleicaoId" TEXT NOT NULL,
    "chapaId" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'valido',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Administrador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Administrador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mesario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mesario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chapa_numero_eleicaoId_key" ON "Chapa"("numero", "eleicaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Eleitor_matricula_eleicaoId_key" ON "Eleitor"("matricula", "eleicaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Credencial_token_key" ON "Credencial"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_email_key" ON "Administrador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mesario_usuario_key" ON "Mesario"("usuario");

-- AddForeignKey
ALTER TABLE "Chapa" ADD CONSTRAINT "Chapa_eleicaoId_fkey" FOREIGN KEY ("eleicaoId") REFERENCES "Eleicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eleitor" ADD CONSTRAINT "Eleitor_eleicaoId_fkey" FOREIGN KEY ("eleicaoId") REFERENCES "Eleicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credencial" ADD CONSTRAINT "Credencial_eleicaoId_fkey" FOREIGN KEY ("eleicaoId") REFERENCES "Eleicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credencial" ADD CONSTRAINT "Credencial_eleitorId_fkey" FOREIGN KEY ("eleitorId") REFERENCES "Eleitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_eleicaoId_fkey" FOREIGN KEY ("eleicaoId") REFERENCES "Eleicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_chapaId_fkey" FOREIGN KEY ("chapaId") REFERENCES "Chapa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

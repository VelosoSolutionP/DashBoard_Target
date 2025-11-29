CREATE TABLE "Venda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendedor" TEXT NOT NULL,
    "valor" REAL NOT NULL
);

INSERT INTO "Venda" (vendedor, valor) VALUES
('João Silva', 1200.50),
('João Silva', 950.75),
('João Silva', 1800.00),
('João Silva', 1400.30),
('João Silva', 1100.90),
('João Silva', 1550.00),
('João Silva', 1700.80),
('João Silva', 250.30),
('João Silva', 480.75),
('João Silva', 320.40),

('Maria Souza', 2100.40),
('Maria Souza', 1350.60),
('Maria Souza', 950.20),
('Maria Souza', 1600.75),
('Maria Souza', 1750.00),
('Maria Souza', 1450.90),
('Maria Souza', 400.50),
('Maria Souza', 180.20),
('Maria Souza', 90.75),

('Carlos Oliveira', 800.50),
('Carlos Oliveira', 1200.00),
('Carlos Oliveira', 1950.30),
('Carlos Oliveira', 1750.80),
('Carlos Oliveira', 1300.60),
('Carlos Oliveira', 300.40),
('Carlos Oliveira', 500.00),
('Carlos Oliveira', 125.75),

('Ana Lima', 1000.00),
('Ana Lima', 1100.50),
('Ana Lima', 1250.75),
('Ana Lima', 1400.20),
('Ana Lima', 1550.90),
('Ana Lima', 1650.00),
('Ana Lima', 75.30),
('Ana Lima', 420.90),
('Ana Lima', 315.40);

CREATE TABLE "Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigoProduto" INTEGER NOT NULL,
    "descricaoProduto" TEXT NOT NULL,
    "estoque" INTEGER NOT NULL
);

INSERT INTO "Produto" (codigoProduto, descricaoProduto, estoque) VALUES
(101, 'Caneta Azul', 150),
(102, 'Caderno Universitário', 75),
(103, 'Borracha Branca', 200),
(104, 'Lápis Preto HB', 320),
(105, 'Marcador de Texto Amarelo', 90);

CREATE TABLE "Movimentacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produtoId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "estoqueAnterior" INTEGER NOT NULL,
    "estoqueAtual" INTEGER NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Movimentacao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
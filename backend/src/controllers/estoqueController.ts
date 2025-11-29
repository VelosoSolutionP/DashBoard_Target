import { FastifyRequest, FastifyReply } from "fastify";
import { EstoqueService } from "../services/estoqueService";
import { prisma } from "../db";

type MovimentarBody = {
  produtoId: number;
  quantidade: number;
  descricao: string;
};

type ProdutoQuery = {
  produtoId?: number;
};

export const estoqueController = {
  movimentar: async (
    req: FastifyRequest<{ Body: MovimentarBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { produtoId, quantidade, descricao } = req.body;
      const resultado = await EstoqueService.movimentar(produtoId, quantidade, descricao);
      return reply.send(resultado);
    } catch (error: any) {
      console.error("Erro ao movimentar estoque:", error.message);
      return reply.status(400).send({ error: error.message });
    }
  },

  listarMovimentacoes: async (
    req: FastifyRequest<{ Querystring: ProdutoQuery }>,
    reply: FastifyReply
  ) => {
    try {
      const { produtoId } = req.query;
      const movimentacoes = await prisma.movimentacao.findMany({
        where: produtoId ? { produtoId } : {},
        include: { produto: true },
        orderBy: { data: "desc" },
      });
      return reply.send(movimentacoes);
    } catch (error: any) {
      console.error("Erro ao listar movimentações:", error.message);
      return reply.status(500).send({ error: "Erro ao listar movimentações" });
    }
  },

  listarProdutos: async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const produtos = await prisma.produto.findMany({
        orderBy: { id: "asc" },
      });
      return reply.send(produtos);
    } catch (error: any) {
      console.error("Erro ao listar produtos:", error.message);
      return reply.status(500).send({ error: "Erro ao listar produtos" });
    }
  },

  ultimaMovimentacao: async (
    req: FastifyRequest<{ Params: { produtoId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const produtoId = Number(req.params.produtoId);
      const ultimaMov = await prisma.movimentacao.findFirst({
        where: { produtoId },
        orderBy: { data: "desc" }, // ou id: "desc"
      });
      return reply.send(ultimaMov ? [ultimaMov] : []);
    } catch (error: any) {
      console.error("Erro ao buscar última movimentação:", error.message);
      return reply.status(500).send({ error: "Erro ao buscar última movimentação" });
    }
  },
};
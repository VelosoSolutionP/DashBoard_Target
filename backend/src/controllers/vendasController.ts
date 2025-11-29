import { FastifyReply, FastifyRequest } from "fastify";
import { VendasService } from "../services/vendasService";

export const vendasController = {
  listar: async (_req: FastifyRequest, reply: FastifyReply) => {
    try {
      const vendas = await VendasService.processarVendas();
      return reply.send(vendas);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error instanceof Error ? error.message : error);
      return reply.status(500).send({ error: "Erro ao processar vendas" });
    }
  },
};
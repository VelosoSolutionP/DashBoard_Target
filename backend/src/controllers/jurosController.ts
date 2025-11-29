import { FastifyRequest, FastifyReply } from "fastify";
import { JurosService } from "../services/jurosService";

type CalcularBody = {
  valor: number;
  vencimento: string;
};

export const jurosController = {
  calcular: async (
    req: FastifyRequest<{ Body: CalcularBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { valor, vencimento } = req.body;

      if (valor <= 0) {
        return reply.status(400).send({ error: "Valor deve ser maior que zero" });
      }

      const dataVenc = new Date(vencimento);
      if (isNaN(dataVenc.getTime())) {
        return reply.status(400).send({ error: "Data de vencimento inválida" });
      }

      const resultado = JurosService.calcular(valor, vencimento);

      return reply.send(resultado);
    } catch (error: any) {
      console.error("Erro ao calcular juros:", error.message);
      return reply.status(500).send({ error: "Erro ao calcular juros" });
    }
  },
};

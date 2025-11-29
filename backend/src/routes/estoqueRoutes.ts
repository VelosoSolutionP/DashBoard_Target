import { FastifyInstance } from "fastify";
import { estoqueController } from "../controllers/estoqueController";

export default async function estoqueRoutes(app: FastifyInstance) {
  app.post("/movimentar", estoqueController.movimentar);
  app.get("/movimentacoes", estoqueController.listarMovimentacoes);
  app.get("/produtos", estoqueController.listarProdutos);

  app.get("/movimentacoes/ultimo/:produtoId", estoqueController.ultimaMovimentacao);
}

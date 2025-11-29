import { FastifyInstance } from "fastify";
import { vendasController } from "../controllers/vendasController";

export default async function vendasRoutes(app: FastifyInstance) {
  app.get("/", vendasController.listar);
}
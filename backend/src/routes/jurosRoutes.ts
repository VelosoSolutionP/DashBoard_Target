import { FastifyInstance } from "fastify";
import { jurosController } from "../controllers/jurosController";

export default async function jurosRoutes(fastify: FastifyInstance) {
  fastify.post("/calcular", jurosController.calcular);
}
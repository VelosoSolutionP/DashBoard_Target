import Fastify from "fastify";
import cors from "@fastify/cors";

import vendasRoutes from "./routes/vendasRoutes";
import estoqueRoutes from "./routes/estoqueRoutes";
import jurosRoutes from "./routes/jurosRoutes";

const app = Fastify({ logger: true });

app.register(cors, {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(vendasRoutes, { prefix: "/vendas" });
app.register(estoqueRoutes, { prefix: "/estoque" });
app.register(jurosRoutes, { prefix: "/juros" });

const start = async () => {
  try {
    await app.listen({ port: 3333 });
    console.log("🚀 API rodando na porta 3333");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
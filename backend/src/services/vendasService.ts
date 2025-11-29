import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class VendasService {
  static async processarVendas() {
    try {
      const vendasDoBanco = await prisma.venda.findMany();

      const vendasComComissao = vendasDoBanco.map((v) => {
        let comissao = 0;
        if (v.valor >= 500) comissao = v.valor * 0.05;
        else if (v.valor >= 100) comissao = v.valor * 0.01;

        return {
          id: v.id,
          vendedor: v.vendedor,
          valor: v.valor,
          comissao,
        };
      });

      return vendasComComissao;
    } catch (error) {
      console.error("Erro no VendasService:", error instanceof Error ? error.message : error);
      throw error;
    }
  }
}
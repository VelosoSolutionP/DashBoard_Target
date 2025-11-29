import { prisma } from "../db";

export class EstoqueService {
  /**
   * Movimenta o estoque de um produto.
   * @param produtoId ID do produto a ser movimentado
   * @param quantidade Quantidade a movimentar (positivo para entrada, negativo para saída)
   * @param descricao Descrição da movimentação
   * @returns Estoque atual após a movimentação
   */
  static async movimentar(produtoId: number, quantidade: number, descricao: string) {
    const produto = await prisma.produto.findUnique({
      where: { id: produtoId }
    });

    if (!produto) {
      throw new Error("Produto não encontrado");
    }

    const novoEstoque = produto.estoque + quantidade;

    if (novoEstoque < 0) {
      throw new Error("Estoque insuficiente para esta movimentação");
    }

    await prisma.produto.update({
      where: { id: produtoId },
      data: { estoque: novoEstoque }
    });

    const ultimaMovimentacao = await prisma.movimentacao.findFirst({
      where: { produtoId },
      orderBy: { id: 'desc' } 
    });

    const estoqueAnterior = ultimaMovimentacao
      ? ultimaMovimentacao.estoqueAtual
      : produto.estoque;

    const movimentacao = await prisma.movimentacao.create({
      data: {
        produtoId,
        quantidade,
        descricao,
        estoqueAnterior,
        estoqueAtual: estoqueAnterior + quantidade
      }
    });

    return {
      produtoId,
      descricao,
      quantidade,
      estoqueAnterior,
      estoqueAtual: estoqueAnterior + quantidade,
      movimentacaoId: movimentacao.id
    };
  }
}
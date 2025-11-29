export interface Venda {
  vendedor: string;
  valor: number;
  comissao: number;
}

export interface Produto {
  id: number;
  codigoProduto: number;
  descricaoProduto: string;
  estoque: number;
}

export interface Movimentacao {
  id: number;
  produtoId: number;
  descricao: string;
  quantidade: number;
  tipo: "entrada" | "saida";
  data: string;
  estoqueAnterior: number;
  estoqueAtual: number;
}

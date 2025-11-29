export class JurosService {
  /**
   * Calcula juros de um valor vencido.
   * @param valor Valor original
   * @param vencimento Data de vencimento no formato 'YYYY-MM-DD'
   * @returns Objeto com dias de atraso, juros e valor final
   */
  static calcular(valor: number, vencimento: string) {
    const dataVenc = new Date(vencimento);
    const hoje = new Date();

    const diasAtraso = Math.floor(
      (hoje.getTime() - dataVenc.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diasAtraso <= 0) {
      return { diasAtraso: 0, juros: 0, valorFinal: valor };
    }

    const juros = parseFloat((valor * 0.025 * diasAtraso).toFixed(2));
    const valorFinal = parseFloat((valor + juros).toFixed(2));

    return { diasAtraso, juros, valorFinal };
  }
}
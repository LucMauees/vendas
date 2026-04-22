export interface ProdutoResponse {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoqueAtual: number;
  categoria: string;
  marca: string;
  nomeFornecedor: string;
  imagemPrincipalUrl: string;
  status: 'DISPONIVEL' | 'INDISPONIVEL' | 'ESGOTADO';
}

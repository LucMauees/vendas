export interface ItemCarrinhoRequest {
  produtoId: number;
  quantidade: number;
}

export interface AtualizarQuantidadeRequest {
  quantidade: number;
}

export interface ItemCarrinhoResponse {
  id: number;
  produtoId: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

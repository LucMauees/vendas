package com.demo.entregas.web.dto;

public record ProdutoResponse(
        Long id,
        String nome,
        String descricao,
        Double preco,
        Integer estoqueAtual,
        String categoria,
        String marca,
        String nomeFornecedor,
        String imagemPrincipalUrl,
        String status
) {
}

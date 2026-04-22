package com.demo.entregas.web.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.demo.entregas.domain.entity.Produto;
import org.springframework.http.ResponseEntity;
import com.demo.entregas.service.ProdutoService;
import com.demo.entregas.web.dto.ProdutoResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Produto Controller", description = "Endpoints para gerenciamento de produtos")
@RequestMapping("/produtos")
@RestController
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @Operation(summary = "Listar produtos", description = "Retorna todos os produtos, com filtro opcional por categoria ou nome")
    @GetMapping
    public ResponseEntity<List<ProdutoResponse>> listar(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String nome) {

        List<ProdutoResponse> produtos = produtoService.listarTodos(categoria, nome)
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(produtos);
    }

    @Operation(summary = "Buscar Produto por ID", description = "Retorna as informações do produto pelo ID")
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(toResponse(produtoService.buscaProdutoId(id)));
    }

    private ProdutoResponse toResponse(Produto p) {
        return new ProdutoResponse(
                p.getId(),
                p.getNome(),
                p.getDescricao(),
                p.getPreco(),
                p.getEstoqueAtual(),
                p.getCategoria(),
                p.getMarca(),
                p.getNomeFornecedor(),
                p.getImagemPrincipalUrl(),
                p.getStatus().name());
    }
}

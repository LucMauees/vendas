package com.demo.entregas.service;

import org.springframework.stereotype.Service;
import com.demo.entregas.repository.ProdutoRepository;

import org.springframework.transaction.annotation.Transactional;

import com.demo.entregas.domain.entity.Produto;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Produto buscaProdutoId(Long id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Produto> listarTodos(String categoria, String nome) {
        if (categoria != null && !categoria.isBlank()) {
            return repository.findByCategoria(categoria);
        }
        if (nome != null && !nome.isBlank()) {
            return repository.findByNomeContainingIgnoreCase(nome);
        }
        return repository.findAll();
    }
}

import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../../core/services/produto.service';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { SessaoService } from '../../core/services/sessao.service';
import { ProdutoResponse } from '../../core/models/produto.model';
import { ProdutoCardComponent } from '../../shared/produto-card/produto-card.component';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ProdutoCardComponent,
  ],
  templateUrl: './vitrine.component.html',
  styleUrl: './vitrine.component.scss',
})
export class VitrineComponent implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  private readonly carrinhoService = inject(CarrinhoService);
  private readonly snack = inject(MatSnackBar);
  readonly sessao = inject(SessaoService);

  todos = signal<ProdutoResponse[]>([]);
  carregando = signal(true);
  busca = signal('');
  categoriaAtiva = signal('Todos');

  categorias = computed(() => {
    const cats = [...new Set(this.todos().map((p) => p.categoria))].sort();
    return ['Todos', ...cats];
  });

  produtos = computed(() => {
    const termo = this.busca().toLowerCase().trim();
    return this.todos().filter((p) => {
      const porCategoria =
        this.categoriaAtiva() === 'Todos' || p.categoria === this.categoriaAtiva();
      const porBusca =
        !termo ||
        p.nome.toLowerCase().includes(termo) ||
        p.marca.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo);
      return porCategoria && porBusca;
    });
  });

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (lista) => {
        this.todos.set(lista);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  selecionarCategoria(cat: string): void {
    this.categoriaAtiva.set(cat);
  }

  adicionarAoCarrinho(produto: ProdutoResponse): void {
    const clienteId = this.sessao.clienteId;
    if (!clienteId) {
      this.snack.open('Faça seu cadastro para comprar', 'Cadastrar', { duration: 4000 });
      return;
    }
    this.carrinhoService.adicionar(clienteId, { produtoId: produto.id, quantidade: 1 }).subscribe({
      next: () =>
        this.snack.open(`"${produto.nome}" adicionado ao carrinho!`, 'OK', { duration: 2500 }),
      error: (err) =>
        this.snack.open(err?.error?.message || 'Erro ao adicionar item', 'Fechar', {
          duration: 4000,
        }),
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProdutoService } from '../../core/services/produto.service';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { SessaoService } from '../../core/services/sessao.service';
import { ProdutoResponse } from '../../core/models/produto.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    RouterLink,
    DecimalPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly produtoService = inject(ProdutoService);
  private readonly carrinhoService = inject(CarrinhoService);
  private readonly snack = inject(MatSnackBar);
  readonly sessao = inject(SessaoService);

  produtoId = '';
  produto = signal<ProdutoResponse | null>(null);
  carregando = signal(false);
  erro = signal('');

  buscarProduto(): void {
    const id = Number(this.produtoId);
    if (!id || id <= 0) {
      this.erro.set('Informe um ID válido');
      return;
    }
    this.erro.set('');
    this.carregando.set(true);
    this.produto.set(null);

    this.produtoService.buscarPorId(id).subscribe({
      next: (p) => {
        this.produto.set(p);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Produto não encontrado');
        this.carregando.set(false);
      },
    });
  }

  adicionarAoCarrinho(produto: ProdutoResponse): void {
    const clienteId = this.sessao.clienteId;
    if (!clienteId) {
      this.snack.open('Faça seu cadastro para adicionar ao carrinho', 'Cadastrar', {
        duration: 4000,
      });
      return;
    }

    this.carrinhoService
      .adicionar(clienteId, { produtoId: Number(this.produtoId), quantidade: 1 })
      .subscribe({
        next: () =>
          this.snack.open(`"${produto.nome}" adicionado ao carrinho!`, 'OK', { duration: 3000 }),
        error: (err) =>
          this.snack.open(
            err?.error?.message || 'Erro ao adicionar item',
            'Fechar',
            { duration: 4000 }
          ),
      });
  }
}

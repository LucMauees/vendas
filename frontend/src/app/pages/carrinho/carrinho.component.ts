import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DecimalPipe } from '@angular/common';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { SessaoService } from '../../core/services/sessao.service';
import { ItemCarrinhoResponse } from '../../core/models/carrinho.model';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.scss',
})
export class CarrinhoComponent implements OnInit {
  readonly carrinhoService = inject(CarrinhoService);
  readonly sessao = inject(SessaoService);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);

  carregando = signal(true);
  colunas = ['produto', 'preco', 'quantidade', 'subtotal', 'acoes'];

  ngOnInit(): void {
    const clienteId = this.sessao.clienteId;
    if (!clienteId) {
      this.router.navigate(['/cadastro']);
      return;
    }
    this.carrinhoService.listar(clienteId).subscribe({
      next: () => this.carregando.set(false),
      error: () => this.carregando.set(false),
    });
  }

  diminuir(item: ItemCarrinhoResponse): void {
    const clienteId = this.sessao.clienteId!;
    if (item.quantidade <= 1) {
      this.remover(item);
      return;
    }
    this.carrinhoService
      .atualizar(clienteId, item.id, { quantidade: item.quantidade - 1 })
      .subscribe({
        error: (err) =>
          this.snack.open(err?.error?.message || 'Erro ao atualizar', 'Fechar', { duration: 3000 }),
      });
  }

  aumentar(item: ItemCarrinhoResponse): void {
    const clienteId = this.sessao.clienteId!;
    this.carrinhoService
      .atualizar(clienteId, item.id, { quantidade: item.quantidade + 1 })
      .subscribe({
        error: (err) =>
          this.snack.open(err?.error?.message || 'Sem estoque suficiente', 'Fechar', {
            duration: 3000,
          }),
      });
  }

  remover(item: ItemCarrinhoResponse): void {
    const clienteId = this.sessao.clienteId!;
    this.carrinhoService.remover(clienteId, item.id).subscribe({
      next: () =>
        this.snack.open(`"${item.nomeProduto}" removido do carrinho`, 'OK', { duration: 2500 }),
      error: () =>
        this.snack.open('Erro ao remover item', 'Fechar', { duration: 3000 }),
    });
  }

  finalizarCompra(): void {
    this.snack.open('Funcionalidade em breve! 🛒', 'OK', { duration: 3000 });
  }
}

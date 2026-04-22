import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProdutoResponse } from '../../core/models/produto.model';

@Component({
  selector: 'app-produto-card',
  standalone: true,
  imports: [
    DecimalPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './produto-card.component.html',
  styleUrl: './produto-card.component.scss',
})
export class ProdutoCardComponent {
  produto = input.required<ProdutoResponse>();
  adicionarAoCarrinho = output<ProdutoResponse>();

  get disponivel(): boolean {
    return this.produto().status === 'DISPONIVEL' && this.produto().estoqueAtual > 0;
  }

  get badgeLabel(): string {
    if (this.produto().status === 'ESGOTADO' || this.produto().estoqueAtual === 0) return 'Esgotado';
    if (this.produto().status === 'INDISPONIVEL') return 'Indisponível';
    return `${this.produto().estoqueAtual} em estoque`;
  }

  get badgeColor(): 'primary' | 'warn' | 'accent' {
    if (!this.disponivel) return 'warn';
    if (this.produto().estoqueAtual <= 5) return 'accent';
    return 'primary';
  }

  onAddClick(): void {
    this.adicionarAoCarrinho.emit(this.produto());
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SessaoService } from './core/services/sessao.service';
import { CarrinhoService } from './core/services/carrinho.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly sessao = inject(SessaoService);
  private readonly carrinho = inject(CarrinhoService);

  ngOnInit(): void {
    const clienteId = this.sessao.clienteId;
    if (clienteId) {
      this.carrinho.listar(clienteId).subscribe();
    }
  }
}

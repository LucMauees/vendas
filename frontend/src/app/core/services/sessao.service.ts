import { Injectable, signal } from '@angular/core';
import { ClienteResponse } from '../models/cliente.model';

const CHAVE = 'cliente_sessao';

@Injectable({ providedIn: 'root' })
export class SessaoService {
  readonly cliente = signal<ClienteResponse | null>(this.carregar());

  salvar(cliente: ClienteResponse): void {
    localStorage.setItem(CHAVE, JSON.stringify(cliente));
    this.cliente.set(cliente);
  }

  sair(): void {
    localStorage.removeItem(CHAVE);
    this.cliente.set(null);
  }

  get clienteId(): number | null {
    return this.cliente()?.id ?? null;
  }

  private carregar(): ClienteResponse | null {
    const raw = localStorage.getItem(CHAVE);
    return raw ? JSON.parse(raw) : null;
  }
}

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ItemCarrinhoRequest,
  AtualizarQuantidadeRequest,
  ItemCarrinhoResponse,
} from '../models/carrinho.model';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/carrinho`;

  readonly itens = signal<ItemCarrinhoResponse[]>([]);
  readonly totalItens = computed(() =>
    this.itens().reduce((acc, i) => acc + i.quantidade, 0)
  );
  readonly totalValor = computed(() =>
    this.itens().reduce((acc, i) => acc + i.subtotal, 0)
  );

  listar(clienteId: number): Observable<ItemCarrinhoResponse[]> {
    return this.http
      .get<ItemCarrinhoResponse[]>(`${this.base}/${clienteId}/itens`)
      .pipe(tap((items) => this.itens.set(items)));
  }

  adicionar(clienteId: number, req: ItemCarrinhoRequest): Observable<ItemCarrinhoResponse> {
    return this.http
      .post<ItemCarrinhoResponse>(`${this.base}/${clienteId}/itens`, req)
      .pipe(tap(() => this.listar(clienteId).subscribe()));
  }

  atualizar(
    clienteId: number,
    itemId: number,
    req: AtualizarQuantidadeRequest
  ): Observable<ItemCarrinhoResponse> {
    return this.http
      .put<ItemCarrinhoResponse>(`${this.base}/${clienteId}/itens/${itemId}`, req)
      .pipe(tap(() => this.listar(clienteId).subscribe()));
  }

  remover(clienteId: number, itemId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/${clienteId}/itens/${itemId}`)
      .pipe(tap(() => this.listar(clienteId).subscribe()));
  }
}

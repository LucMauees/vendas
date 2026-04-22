import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProdutoResponse } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/produtos`;

  listar(filtros?: { categoria?: string; nome?: string }): Observable<ProdutoResponse[]> {
    let params = new HttpParams();
    if (filtros?.categoria) params = params.set('categoria', filtros.categoria);
    if (filtros?.nome) params = params.set('nome', filtros.nome);
    return this.http.get<ProdutoResponse[]>(this.base, { params });
  }

  buscarPorId(id: number): Observable<ProdutoResponse> {
    return this.http.get<ProdutoResponse>(`${this.base}/${id}`);
  }
}

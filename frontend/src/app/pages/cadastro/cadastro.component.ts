import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClienteService } from '../../core/services/cliente.service';
import { SessaoService } from '../../core/services/sessao.service';
import { CarrinhoService } from '../../core/services/carrinho.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly clienteService = inject(ClienteService);
  private readonly sessao = inject(SessaoService);
  private readonly carrinho = inject(CarrinhoService);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);

  enviando = signal(false);
  senhaVisivel = signal(false);

  form = this.fb.group({
    nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    telefone: ['', [Validators.required]],
    cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
  });

  get f() {
    return this.form.controls;
  }

  cadastrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);

    this.clienteService.cadastrar(this.form.getRawValue() as any).subscribe({
      next: (cliente) => {
        this.sessao.salvar(cliente);
        this.carrinho.listar(cliente.id).subscribe();
        this.snack.open(`Bem-vindo, ${cliente.nomeCompleto.split(' ')[0]}!`, 'OK', {
          duration: 3000,
        });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.enviando.set(false);
        this.snack.open(
          err?.error?.message || 'Erro ao cadastrar. Tente novamente.',
          'Fechar',
          { duration: 5000 }
        );
      },
    });
  }
}

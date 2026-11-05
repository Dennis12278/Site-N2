import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  modoCadastro = false;

  nome = '';
  email = '';
  senha = '';

  enviando = false;
  erro = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  alternarModo(): void {
    this.modoCadastro = !this.modoCadastro;
    this.erro = '';
  }

  enviar(): void {

    if (this.enviando) {
      return;
    }

    this.erro = '';

    if (this.email.trim() === '' || this.senha === '') {
      this.erro = 'Informe o e-mail e a senha.';
      return;
    }

    if (this.modoCadastro && this.nome.trim() === '') {
      this.erro = 'Informe seu nome.';
      return;
    }

    this.enviando = true;

    if (this.modoCadastro) {
      this.apiService.cadastrar({
        nome: this.nome.trim(),
        email: this.email.trim(),
        senha: this.senha
      }).subscribe({
        next: usuario => this.concluir(usuario),
        error: erro => this.falhar(erro)
      });

      return;
    }

    this.apiService.login({
      email: this.email.trim(),
      senha: this.senha
    }).subscribe({
      next: usuario => this.concluir(usuario),
      error: erro => this.falhar(erro)
    });
  }

  private concluir(usuario: any): void {
    SessaoService.entrar({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    });

    this.router.navigate(['/']);
  }

  private falhar(erro: any): void {
    this.enviando = false;

    // a API devolve a mensagem como texto (400, 401 ou 409)
    this.erro = typeof erro?.error === 'string'
      ? erro.error
      : 'Não foi possível entrar. Verifique se a API está rodando.';

    this.changeDetectorRef.detectChanges();
  }
}

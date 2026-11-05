import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css'
})
export class Configuracoes {

  abaAtiva: string = 'conta';

  usuarioInicial: string = 'D';

  email: string = '';

  novaSenha: string = '';

  confirmarSenha: string = '';

  perfilPublico: boolean = true;

  mostrarPublicacoes: boolean = true;

  mostrarEstatisticas: boolean = true;

  tema: string = 'escuro';


  // ==============================
  // SALVAR CONTA
  // ==============================

  salvarConta(): void {

    if (this.novaSenha !== this.confirmarSenha) {

      alert('As senhas não são iguais.');

      return;
    }

    if (
      this.novaSenha !== '' &&
      this.novaSenha.length < 6
    ) {

      alert('A senha deve possuir pelo menos 6 caracteres.');

      return;
    }

    alert('Alterações da conta salvas com sucesso!');
  }


  // ==============================
  // SALVAR VISIBILIDADE
  // ==============================

  salvarVisibilidade(): void {

    alert('Preferências de visibilidade salvas com sucesso!');
  }


  // ==============================
  // SALVAR TEMA
  // ==============================

  salvarTema(): void {

    alert('Preferência de tema salva com sucesso!');
  }

}

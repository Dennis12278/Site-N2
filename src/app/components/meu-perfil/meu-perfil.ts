import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meu-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './meu-perfil.html',
  styleUrl: './meu-perfil.css',
})
export class MeuPerfil {

  avatarUrl: string | null = null;

  constructor(private router: Router) {}

  selecionarAvatar(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const arquivo = input.files[0];

    if (!arquivo.type.startsWith('image/')) {
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      this.avatarUrl = leitor.result as string;
    };

    leitor.readAsDataURL(arquivo);
  }


  irParaEditarPerfil(): void {
    this.router.navigate(['/meu-perfil']);
  }


  irParaTitulosSeguidos(): void {
    this.router.navigate(['/titulos-seguidos']);
  }


  irParaUsuariosSeguidos(): void {
    this.router.navigate(['/usuarios-seguidos']);
  }


  irParaGruposSeguidos(): void {
    this.router.navigate(['/grupos-seguidos']);
  }


  irParaHistorico(): void {
    this.router.navigate(['/historico-leitura']);
  }


  irParaColecoes(): void {
    this.router.navigate(['/colecoes']);
  }


  irParaNotificacoes(): void {
    this.router.navigate(['/notificacoes']);
  }


  irParaMinhasPublicacoes(): void {
    this.router.navigate(['/minhas-publicacoes']);
  }


  irParaConfiguracoes(): void {
    this.router.navigate(['/configuracoes']);
  }


  irParaPerfilPublico(): void {
    this.router.navigate(['/perfil-publico']);
  }

}

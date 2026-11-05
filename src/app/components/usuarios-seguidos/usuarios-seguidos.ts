import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';

interface UsuarioSeguido {
  nome: string;
  usuario: string;
  avatar?: string;
  publicacoes: number;
  seguidoHa: string;
}

@Component({
  selector: 'app-usuarios-seguidos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './usuarios-seguidos.html',
  styleUrl: './usuarios-seguidos.css'
})
export class UsuariosSeguidos {

  pesquisa: string = '';

  ordenacao: string = 'Recentes';


  /* =========================================
     USUÁRIOS SEGUIDOS
  ========================================= */

  usuarios: UsuarioSeguido[] = [

    {
      nome: 'zzyzzy',
      usuario: '@duziebby',
      avatar: '',
      publicacoes: 0,
      seguidoHa: '4 segundos'
    }

  ];


  constructor(private router: Router) {}


  /* =========================================
     NAVEGAÇÃO
  ========================================= */

  irParaMeuPerfil(): void {
    this.router.navigate(['/meu-perfil']);
  }

  irParaPerfilPublico() {
  this.router.navigate(['/perfil-publico']);
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


  /* =========================================
     ORDENAR
  ========================================= */

  selecionarOrdenacao(tipo: string): void {

    this.ordenacao = tipo;

  }


  /* =========================================
     USUÁRIOS FILTRADOS
  ========================================= */

  get usuariosFiltrados(): UsuarioSeguido[] {

    let resultado = [...this.usuarios];


    /* PESQUISA */

    if (this.pesquisa.trim() !== '') {

      const texto =
        this.pesquisa.toLowerCase().trim();

      resultado = resultado.filter(usuario =>
        usuario.nome.toLowerCase().includes(texto) ||
        usuario.usuario.toLowerCase().includes(texto)
      );

    }


    /* ORDEM ALFABÉTICA */

    if (this.ordenacao === 'A-Z') {

      resultado.sort((a, b) =>
        a.nome.localeCompare(b.nome)
      );

    }


    return resultado;

  }


  /* =========================================
     DEIXAR DE SEGUIR
  ========================================= */

  deixarDeSeguir(usuario: UsuarioSeguido): void {

    const confirmar =
      confirm(
        `Deseja deixar de seguir ${usuario.nome}?`
      );

    if (!confirmar) {
      return;
    }


    this.usuarios =
      this.usuarios.filter(
        item => item !== usuario
      );

  }

}

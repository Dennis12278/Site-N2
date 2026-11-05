import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';

interface Titulo {
  titulo: string;
  status: string;
  capa: string;
  ultimaLeitura: Date;
}

@Component({
  selector: 'app-titulos-seguidos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './titulos-seguidos.html',
  styleUrl: './titulos-seguidos.css'
})
export class TitulosSeguidos {

  filtroAtual = 'Todos';

  ordenacaoAtual = 'Adicionados recentemente';

  pesquisa = '';

  constructor(private router: Router) {}


  // =========================================
  // NAVEGAÇÃO DO MENU LATERAL
  // =========================================

  irParaMeuPerfil(): void {
    this.router.navigate(['/meu-perfil']);
  }


  irParaTitulosSeguidos(): void {
    this.router.navigate(['/titulos-seguidos']);
  }


  irParaMinhasPublicacoes(): void {
    this.router.navigate(['/minhas-publicacoes']);
  }


  irParaConfiguracoes(): void {
    this.router.navigate(['/configuracoes']);
  }


  // =========================================
  // ABRIR TÍTULO
  // =========================================

  abrirTitulo(titulo: Titulo): void {

    console.log('Título selecionado:', titulo.titulo);

  }


  // =========================================
  // SEGUIR TÍTULO
  // =========================================

  seguirTitulo(titulo: Titulo): void {

    console.log('Seguindo título:', titulo.titulo);

  }


  // =========================================
  // ADICIONAR À COLEÇÃO
  // =========================================

  adicionarColecao(titulo: Titulo): void {

    console.log('Adicionar à coleção:', titulo.titulo);

  }


  // =========================================
  // TÍTULOS
  // =========================================

  titulos: Titulo[] = [

    {
      titulo: 'Título de exemplo',
      status: 'Lendo',
      capa: '/capas/titulo-exemplo.jpg',
      ultimaLeitura: new Date()
    },

    {
      titulo: 'Outro título',
      status: 'Planejo ler',
      capa: '/capas/outro-titulo.jpg',
      ultimaLeitura: new Date(
        Date.now() - 2 * 60 * 60 * 1000
      )
    },

    {
      titulo: 'Meu terceiro título',
      status: 'Concluídos',
      capa: '/capas/meu-terceiro-titulo.jpg',
      ultimaLeitura: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000
      )
    },

    {
      titulo: 'História do Brasil',
      status: 'Em espera',
      capa: '/capas/historia-brasil.jpg',
      ultimaLeitura: new Date(
        Date.now() - 2 * 30 * 24 * 60 * 60 * 1000
      )
    },

    {
      titulo: 'Biologia',
      status: 'Abandonados',
      capa: '/capas/biologia.jpg',
      ultimaLeitura: new Date(
        Date.now() - 2 * 365 * 24 * 60 * 60 * 1000
      )
    }

  ];


  // =========================================
  // FILTRO
  // =========================================

  selecionarFiltro(filtro: string): void {

    this.filtroAtual = filtro;

  }


  // =========================================
  // ORDENAÇÃO
  // =========================================

  selecionarOrdenacao(ordenacao: string): void {

    this.ordenacaoAtual = ordenacao;

  }


  // =========================================
  // TÍTULOS FILTRADOS
  // =========================================

  get titulosFiltrados(): Titulo[] {

    let resultado = [...this.titulos];


    // FILTRO POR STATUS

    if (this.filtroAtual !== 'Todos') {

      resultado = resultado.filter(
        titulo => titulo.status === this.filtroAtual
      );

    }


    // PESQUISA

    if (this.pesquisa.trim() !== '') {

      const texto = this.pesquisa.toLowerCase();

      resultado = resultado.filter(
        titulo =>
          titulo.titulo
            .toLowerCase()
            .includes(texto)
      );

    }


    // ORDENAÇÃO

    if (this.ordenacaoAtual === 'Lidos recentemente') {

      resultado.sort(
        (a, b) =>
          b.ultimaLeitura.getTime() -
          a.ultimaLeitura.getTime()
      );

    }

    return resultado;

  }


  // =========================================
  // TEMPO DESDE A LEITURA
  // =========================================

  tempoDesdeLeitura(data: Date): string {

    const agora = new Date();

    const diferenca =
      agora.getTime() - data.getTime();


    const segundos =
      Math.floor(diferenca / 1000);


    if (segundos < 60) {

      return `Lido há ${segundos} segundo${segundos === 1 ? '' : 's'}`;

    }


    const minutos =
      Math.floor(segundos / 60);


    if (minutos < 60) {

      return `Lido há ${minutos} minuto${minutos === 1 ? '' : 's'}`;

    }


    const horas =
      Math.floor(minutos / 60);


    if (horas < 24) {

      return `Lido há ${horas} hora${horas === 1 ? '' : 's'}`;

    }


    const dias =
      Math.floor(horas / 24);


    if (dias < 30) {

      return `Lido há ${dias} dia${dias === 1 ? '' : 's'}`;

    }


    const meses =
      Math.floor(dias / 30);


    if (meses < 12) {

      return `Lido há ${meses} ${meses === 1 ? 'mês' : 'meses'}`;

    }


    const anos =
      Math.floor(meses / 12);


    return `Lido há ${anos} ano${anos === 1 ? '' : 's'}`;

  }

}

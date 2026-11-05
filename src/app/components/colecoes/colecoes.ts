import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

interface Colecao {
  id: number;
  usuario: string;
  titulo: string;
  descricao: string;
  tipo: string;
  quantidadeTitulos: number;
  criadoHa: string;
  atualizadoHa: string;
  capas: (string | null)[];
  curtidas: number;
  curtiu: boolean;
}

@Component({
  selector: 'app-colecoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './colecoes.html',
  styleUrl: './colecoes.css'
})
export class Colecoes implements OnInit {

  abaAtiva = 'meu';

  pesquisando = '';

  tipoSelecionado = 'Todos';

  ordenacaoSelecionada = 'Mais recentes';

  criandoColecao = false;

  nomeColecao = '';

  descricaoColecao = '';

  visibilidade = 'publica';

  buscaTitulo = '';

  minhasColecoes: Colecao[] = [];

  colecoesCurtidas: Colecao[] = [];


  constructor(
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }


  ngOnInit(): void {

    this.carregarColecoes();

  }


  carregarColecoes(): void {

    const usuario = SessaoService.usuario();

    if (!usuario) {
      return;
    }

    this.apiService.listarMinhasColecoes(usuario.id).subscribe({

      next: itens => {

        this.minhasColecoes = itens.map(item => this.paraColecao(item, usuario.id));

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {
        console.error('Erro ao buscar suas coleções:', erro);
      }

    });

    this.apiService.listarColecoesCurtidas(usuario.id).subscribe({

      next: itens => {

        this.colecoesCurtidas = itens.map(item => this.paraColecao(item, usuario.id));

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {
        console.error('Erro ao buscar coleções curtidas:', erro);
      }

    });

  }

  private paraColecao(item: any, idUsuarioLogado: number): Colecao {

    return {
      id: item.id,
      usuario: item.idUsuario === idUsuarioLogado ? 'Você' : item.nomeUsuario,
      titulo: item.titulo,
      descricao: '',
      tipo: item.visibilidade === 'privada' ? 'Privada' : 'Pública',
      quantidadeTitulos: item.quantidadeTitulos,
      criadoHa: this.tempoRelativo(item.dataCriacao),
      atualizadoHa: this.tempoRelativo(item.dataCriacao),
      capas: (item.capas ?? []).filter((c: string | null) => !!c).map((c: string) => this.apiService.urlCapa(c)),
      curtidas: item.curtidas,
      curtiu: item.curtiu
    };

  }


  tempoRelativo(data: string): string {

    const dataCriacao =
      new Date(data);

    const agora =
      new Date();

    const diferenca =
      agora.getTime() -
      dataCriacao.getTime();

    const minutos =
      Math.floor(
        diferenca / 60000
      );

    if (minutos < 1) {
      return 'agora';
    }

    if (minutos < 60) {
      return `há ${minutos} min`;
    }

    const horas =
      Math.floor(minutos / 60);

    if (horas < 24) {
      return `há ${horas} h`;
    }

    const dias =
      Math.floor(horas / 24);

    if (dias === 1) {
      return 'há 1 dia';
    }

    return `há ${dias} dias`;

  }


  get colecoesAtuais(): Colecao[] {

    if (this.abaAtiva === 'curtido') {
      return this.colecoesCurtidas;
    }

    return this.minhasColecoes;
  }


  get colecoesFiltradas(): Colecao[] {

    let colecoes =
      [...this.colecoesAtuais];

    if (this.pesquisando.trim() !== '') {

      const pesquisa =
        this.pesquisando
          .toLowerCase()
          .trim();

      colecoes =
        colecoes.filter(colecao =>
          colecao.titulo
            .toLowerCase()
            .includes(pesquisa) ||

          colecao.descricao
            .toLowerCase()
            .includes(pesquisa) ||

          colecao.usuario
            .toLowerCase()
            .includes(pesquisa)
        );

    }


    if (this.tipoSelecionado !== 'Todos') {

      colecoes =
        colecoes.filter(
          colecao =>
            colecao.tipo ===
            this.tipoSelecionado
        );

    }


    if (this.ordenacaoSelecionada === 'Título') {

      colecoes.sort((a, b) =>
        a.titulo.localeCompare(
          b.titulo
        )
      );

    }


    if (this.ordenacaoSelecionada === 'Mais antigas') {

      colecoes.reverse();

    }

    return colecoes;
  }


  selecionarAba(aba: string): void {

    this.abaAtiva = aba;

    this.pesquisando = '';

    this.tipoSelecionado = 'Todos';

    this.ordenacaoSelecionada =
      'Mais recentes';

  }


  abrirColecao(colecao: Colecao): void {

    this.router.navigate(['/colecao', colecao.id]);

  }


  abrirNovaColecao(): void {

    this.router.navigate([
      '/nova-colecao'
    ]);

  }


  cancelarCriacao(): void {

    this.criandoColecao = false;

    this.nomeColecao = '';

    this.descricaoColecao = '';

    this.buscaTitulo = '';

  }


  criarColecao(): void {

    this.abrirNovaColecao();

  }


  excluirColecao(
    colecao: Colecao
  ): void {

    const confirmar =
      confirm(
        'Deseja excluir esta coleção?'
      );

    if (!confirmar) {
      return;
    }


    const usuario = SessaoService.usuario();

    if (!usuario) {
      return;
    }

    this.apiService
      .excluirColecaoPublica(colecao.id, usuario.id)
      .subscribe({

        next: () => {

          this.minhasColecoes =
            this.minhasColecoes.filter(
              item =>
                item.id !== colecao.id
            );

          alert(
            'Coleção excluída com sucesso!'
          );

        },

        error: erro => {

          console.error(
            'Erro ao excluir coleção:',
            erro
          );

          alert(
            'Não foi possível excluir a coleção.'
          );

        }

      });

  }


  redefinirFiltros(): void {

    this.pesquisando = '';

    this.tipoSelecionado = 'Todos';

    this.ordenacaoSelecionada =
      'Mais recentes';

  }

}
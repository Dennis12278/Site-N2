import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

interface Leitura {
  idDocumento: number;
  titulo: string;
  capa: string;
  lido: string;
  total: string;
  progresso: number;
  lidoHa: string;
}

interface ColecaoHome {
  id: number;
  idUsuario: number;
  usuario: string;
  capas: (string | null)[];
  titulo: string;
  quantidadeTitulos: number;
  tempo: string;
  curtidas: number;
  curtiu: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  documentos: any[] = [];

  documentosRanking: any[] = [];

  colecoesHome: ColecaoHome[] = [];

  filtroColecao: 'todas' | 'minhas' | 'curtidas' = 'todas';

  historicoMinimizado = false;

  menuHistoricoAberto = false;

  paginaHistorico = 0;

  paginaRanking = 0;

  paginaSeguidores = 0;

  paginaColecoes = 0;

  rankingAtual = 'recentes';


  leituras: Leitura[] = [];


  constructor(
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.carregarDocumentos();
    this.carregarHistorico();
    this.carregarColecoes();
  }


  carregarDocumentos(): void {

    this.apiService.listarDocumentos(true).subscribe({

      next: documentos => {

        this.documentos = documentos
          .filter(documento => documento.publicado === true)
          .sort((a, b) => {

            const dataA =
              new Date(a.dataPublicacao).getTime();

            const dataB =
              new Date(b.dataPublicacao).getTime();

            return dataB - dataA;

          });


        this.atualizarRanking();

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {

        console.error(
          'Erro ao buscar documentos:',
          erro
        );

      }

    });

  }


  carregarHistorico(): void {

    const usuario = SessaoService.usuario();

    if (!usuario) {
      return;
    }

    this.apiService.listarHistorico(usuario.id).subscribe({

      next: itens => {

        this.leituras = itens.map(item => ({
          idDocumento: item.idDocumento,
          titulo: item.titulo,
          capa: item.capa ?? '',
          lido: '',
          total: '',
          progresso: item.progresso,
          lidoHa: this.tempoPublicacao(item.dataUltimaLeitura)
        }));

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {
        console.error('Erro ao buscar histórico:', erro);
      }

    });

  }


  carregarColecoes(): void {

    const usuario = SessaoService.usuario();

    this.apiService.listarColecoesPublicas(usuario ? usuario.id : 0).subscribe({

      next: itens => {

        this.colecoesHome = itens.map(item => ({
          id: item.id,
          idUsuario: item.idUsuario,
          curtiu: item.curtiu,
          usuario: item.nomeUsuario,
          capas: item.capas ?? [],
          titulo: item.titulo,
          quantidadeTitulos: item.quantidadeTitulos,
          tempo: this.tempoPublicacao(item.dataCriacao),
          curtidas: item.curtidas
        }));

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {
        console.error('Erro ao buscar coleções públicas:', erro);
      }

    });

  }

  abrirColecao(colecao: ColecaoHome): void {

    this.router.navigate(['/colecao', colecao.id]);

  }


  atualizarRanking(): void {

    const inicio =
      this.paginaRanking * 5;

    this.documentosRanking =
      this.documentos.slice(
        inicio,
        inicio + 5
      );

  }


  selecionarRanking(ranking: string): void {

    this.rankingAtual = ranking;

    this.paginaRanking = 0;

    this.atualizarRanking();

  }


  rankingProximo(): void {

    if (this.paginaRanking < 1) {

      this.paginaRanking++;

      this.atualizarRanking();

    }

  }


  rankingAnterior(): void {

    if (this.paginaRanking > 0) {

      this.paginaRanking--;

      this.atualizarRanking();

    }

  }


  seguidoresProximo(): void {

    if (this.paginaSeguidores < 1) {

      this.paginaSeguidores++;

    }

  }


  seguidoresAnterior(): void {

    if (this.paginaSeguidores > 0) {

      this.paginaSeguidores--;

    }

  }


  colecoesProxima(): void {

    if (this.paginaColecoes < 1) {

      this.paginaColecoes++;

    }

  }


  colecoesAnterior(): void {

    if (this.paginaColecoes > 0) {

      this.paginaColecoes--;

    }

  }


  get colecoesFiltradas(): ColecaoHome[] {

    const usuario = SessaoService.usuario();

    if (this.filtroColecao === 'minhas') {
      return this.colecoesHome.filter(c => !!usuario && c.idUsuario === usuario.id);
    }

    if (this.filtroColecao === 'curtidas') {
      return this.colecoesHome.filter(c => c.curtiu);
    }

    return this.colecoesHome;

  }

  get colecoesExibidas(): ColecaoHome[] {

    const inicio = this.paginaColecoes * 5;

    return this.colecoesFiltradas.slice(inicio, inicio + 5);

  }

  selecionarFiltroColecao(filtro: 'todas' | 'minhas' | 'curtidas'): void {

    this.filtroColecao = filtro;
    this.paginaColecoes = 0;

  }


  tempoPublicacao(data: string): string {

    if (!data) {

      return '';

    }


    const agora =
      new Date().getTime();

    const publicacao =
      new Date(data).getTime();

    const diferenca =
      agora - publicacao;

    const minutos =
      Math.floor(
        diferenca / 60000
      );


    if (minutos < 1) {

      return 'agora';

    }


    if (minutos < 60) {

      return minutos +
        (
          minutos === 1
            ? ' minuto atrás'
            : ' minutos atrás'
        );

    }


    const horas =
      Math.floor(
        minutos / 60
      );


    if (horas < 24) {

      return horas +
        (
          horas === 1
            ? ' hora atrás'
            : ' horas atrás'
        );

    }


    const dias =
      Math.floor(
        horas / 24
      );


    if (dias < 30) {

      return dias +
        (
          dias === 1
            ? ' dia atrás'
            : ' dias atrás'
        );

    }


    const meses =
      Math.floor(
        dias / 30
      );


    return meses +
      (
        meses === 1
          ? ' mês atrás'
          : ' meses atrás'
      );

  }


  urlCapa(capa: string | null): string {

    return this.apiService.urlCapa(capa);

  }


  abrirPublicacao(documento: any): void {

    this.router.navigate([
      '/publicacao',
      documento.id
    ]);

  }


  irParaTitulos(): void {

    this.router.navigate([
      '/titulos-seguidos'
    ]);

  }


  irParaCalendario(): void {

    this.router.navigate([
      '/calendario'
    ]);

  }


  irParaMeuPerfil(): void {

    this.router.navigate([
      '/meu-perfil'
    ]);

  }


  irParaHistorico(): void {

    this.router.navigate([
      '/historico-leitura'
    ]);

  }


  irParaPublicacoes(): void {

    this.router.navigate([
      '/minhas-publicacoes'
    ]);

  }


  irParaGrupos(): void {

    this.router.navigate([
      '/grupos-seguidos'
    ]);

  }


  irParaColecoes(): void {

    this.router.navigate([
      '/colecoes'
    ]);

  }


  abrirMenuHistorico(event: MouseEvent): void {

    event.stopPropagation();

    this.menuHistoricoAberto =
      !this.menuHistoricoAberto;

  }


  fecharMenuHistorico(): void {

    this.menuHistoricoAberto = false;

  }


  minimizarHistorico(): void {

    this.historicoMinimizado = true;

    this.menuHistoricoAberto = false;

  }


  mostrarHistorico(): void {

    this.historicoMinimizado = false;

    this.menuHistoricoAberto = false;

  }


  proximaPaginaHistorico(): void {

    if (this.paginaHistorico < 1) {

      this.paginaHistorico++;

    }

  }


  paginaAnteriorHistorico(): void {

    if (this.paginaHistorico > 0) {

      this.paginaHistorico--;

    }

  }


  get leiturasExibidas(): Leitura[] {

    const inicio =
      this.paginaHistorico * 5;

    return this.leituras.slice(
      inicio,
      inicio + 5
    );

  }

}
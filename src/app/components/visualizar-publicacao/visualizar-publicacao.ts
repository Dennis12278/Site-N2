import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

interface OpcaoMarcador {
  valor: string;
  texto: string;
  icone: string;
}

interface ColecaoOpcao {
  id: number;
  titulo: string;
  contem: boolean;
  salvando: boolean;
}

@Component({
  selector: 'app-visualizar-publicacao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './visualizar-publicacao.html',
  styleUrl: './visualizar-publicacao.css'
})
export class VisualizarPublicacao implements OnInit, OnDestroy {

  // ===== PROGRESSO DE LEITURA =====

  // maior porcentagem já alcançada nesta abertura da publicação
  private progressoAtual = 0;

  // última porcentagem enviada à API (evita enviar a mesma coisa várias vezes)
  private progressoEnviado = 0;

  private timerProgresso: any = null;

  private timerPaginaCurta: any = null;

  publicacao: any = null;

  carregando = true;

  descricaoExpandida = false;

  // qual menu está aberto
  menuAberto: 'seguir' | 'colecao' | null = null;

  /* ---------- marcadores (botão Seguir) ---------- */

  marcadorAtual = '';

  salvandoMarcador = false;

  readonly opcoes: OpcaoMarcador[] = [
    { valor: 'lendo', texto: 'Lendo', icone: 'bi-book' },
    { valor: 'concluido', texto: 'Concluído', icone: 'bi-check2-circle' },
    { valor: 'pausado', texto: 'Em pausa', icone: 'bi-pause-circle' },
    { valor: 'quero-ler', texto: 'Quero ler', icone: 'bi-bookmark-plus' },
    { valor: 'abandonado', texto: 'Abandonado', icone: 'bi-x-circle' }
  ];

  /* ---------- coleções (botão Adicionar à coleção) ---------- */

  colecoes: ColecaoOpcao[] = [];

  carregandoColecoes = false;

  buscaColecao = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }


  /* =========================================
     CARREGAR PUBLICAÇÃO
  ========================================= */

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.carregando = false;
      return;
    }

    this.apiService.obterDocumento(id).subscribe({

      next: publicacao => {

        this.publicacao = publicacao;
        this.carregando = false;

        this.registrarLeitura(publicacao.id);
        this.iniciarEnvioProgresso(publicacao.id);
        this.carregarMarcador(publicacao.id);

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {

        console.error('Erro ao buscar publicação:', erro);

        this.carregando = false;

        this.changeDetectorRef.detectChanges();

      }

    });

  }

  private registrarLeitura(idDocumento: number): void {

    const usuario = SessaoService.usuario();

    if (!usuario) {
      return;
    }

    this.apiService.registrarLeitura(usuario.id, idDocumento).subscribe({
      error: erro => console.error('Erro ao registrar leitura:', erro)
    });

  }

  private carregarMarcador(idDocumento: number): void {

    const usuario = SessaoService.usuario();

    if (!usuario) {
      return;
    }

    this.apiService.obterMarcador(usuario.id, idDocumento).subscribe({

      next: resposta => {
        this.marcadorAtual = resposta.marcador ?? '';
        this.changeDetectorRef.detectChanges();
      },

      error: erro => console.error('Erro ao buscar marcador:', erro)

    });

  }


  /* =========================================
     DESCRIÇÃO
  ========================================= */

  get descricaoLonga(): boolean {
    return (this.publicacao?.conteudo ?? '').length > 280;
  }

  alternarDescricao(): void {
    this.descricaoExpandida = !this.descricaoExpandida;
  }


  /* =========================================
     MENUS
  ========================================= */

  get textoMarcadorAtual(): string {

    const opcao = this.opcoes.find(o => o.valor === this.marcadorAtual);

    return opcao ? opcao.texto : '';

  }

  alternarMenu(tipo: 'seguir' | 'colecao', event: Event): void {

    event.stopPropagation();

    if (this.menuAberto === tipo) {
      this.menuAberto = null;
      return;
    }

    this.menuAberto = tipo;

    if (tipo === 'colecao') {
      this.carregarColecoes();
    }

  }

  fecharMenu(): void {
    this.menuAberto = null;
  }


  /* =========================================
     MARCADORES (botão Seguir)
  ========================================= */

  // clicar no marcador já escolhido remove ele
  escolherMarcador(valor: string): void {

    const novo = this.marcadorAtual === valor ? '' : valor;

    this.salvarMarcador(novo);

  }

  removerMarcador(): void {
    this.salvarMarcador('');
  }

  private salvarMarcador(novo: string): void {

    const usuario = SessaoService.usuario();

    if (!usuario || !this.publicacao || this.salvandoMarcador) {
      return;
    }

    this.salvandoMarcador = true;

    this.apiService.definirMarcador(usuario.id, this.publicacao.id, novo).subscribe({

      next: () => {

        this.marcadorAtual = novo;
        this.salvandoMarcador = false;
        this.menuAberto = null;

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {

        console.error('Erro ao salvar marcador:', erro);

        this.salvandoMarcador = false;

        alert('Não foi possível salvar o marcador.');

        this.changeDetectorRef.detectChanges();

      }

    });

  }


  /* =========================================
     COLEÇÕES (botão Adicionar à coleção)
  ========================================= */

  get colecoesFiltradas(): ColecaoOpcao[] {

    const texto = this.buscaColecao.trim().toLowerCase();

    if (texto === '') {
      return this.colecoes;
    }

    return this.colecoes.filter(c =>
      c.titulo.toLowerCase().includes(texto)
    );

  }

  private carregarColecoes(): void {

    const usuario = SessaoService.usuario();

    if (!usuario || !this.publicacao) {
      return;
    }

    this.carregandoColecoes = true;

    this.apiService.listarColecoesComPublicacao(usuario.id, this.publicacao.id).subscribe({

      next: itens => {

        this.colecoes = itens.map(item => ({
          id: item.id,
          titulo: item.titulo,
          contem: item.contem,
          salvando: false
        }));

        this.carregandoColecoes = false;
        this.changeDetectorRef.detectChanges();

      },

      error: erro => {

        console.error('Erro ao buscar coleções:', erro);

        this.carregandoColecoes = false;
        this.changeDetectorRef.detectChanges();

      }

    });

  }

  alternarColecao(colecao: ColecaoOpcao): void {

    if (colecao.salvando || !this.publicacao) {
      return;
    }

    const adicionar = !colecao.contem;

    colecao.salvando = true;

    const chamada = adicionar
      ? this.apiService.adicionarPublicacaoNaColecao(colecao.id, this.publicacao.id)
      : this.apiService.removerPublicacaoDaColecao(colecao.id, this.publicacao.id);

    chamada.subscribe({

      next: () => {

        colecao.contem = adicionar;
        colecao.salvando = false;

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {

        console.error('Erro ao alterar coleção:', erro);

        colecao.salvando = false;

        alert('Não foi possível alterar a coleção.');

        this.changeDetectorRef.detectChanges();

      }

    });

  }

  criarNovaColecao(): void {

    this.menuAberto = null;

    this.router.navigate(['/nova-colecao']);

  }


  /* =========================================
     NAVEGAÇÃO
  ========================================= */

  /* =========================================
     PROGRESSO DE LEITURA (rolagem da página)
  ========================================= */

  @HostListener('window:scroll')
  aoRolar(): void {

    const alturaTotal = document.documentElement.scrollHeight;
    const alturaVisivel = window.innerHeight;
    const rolado = window.scrollY;

    // página cabe na tela: conta como lida após alguns segundos
    if (alturaTotal <= alturaVisivel) {
      return;
    }

    const porcentagem = Math.round((rolado + alturaVisivel) / alturaTotal * 100);

    if (porcentagem > this.progressoAtual) {
      this.progressoAtual = Math.min(porcentagem, 100);
    }

  }

  // envia o progresso a cada 10 segundos, se mudou
  private iniciarEnvioProgresso(idDocumento: number): void {

    this.timerProgresso = setInterval(() => {
      this.enviarProgresso(idDocumento);
    }, 10000);

    // se a página couber na tela, conta como lida depois de 8 segundos aberta
    this.timerPaginaCurta = setTimeout(() => {
      const alturaTotal = document.documentElement.scrollHeight;

      if (alturaTotal <= window.innerHeight) {
        this.progressoAtual = 100;
        this.enviarProgresso(idDocumento);
      }
    }, 8000);

  }

  private enviarProgresso(idDocumento: number): void {

    const usuario = SessaoService.usuario();

    if (!usuario || this.progressoAtual <= this.progressoEnviado) {
      return;
    }

    this.progressoEnviado = this.progressoAtual;

    this.apiService.atualizarProgressoLeitura(usuario.id, idDocumento, this.progressoAtual).subscribe({
      error: erro => console.error('Erro ao salvar progresso:', erro)
    });

  }

  ngOnDestroy(): void {

    if (this.timerProgresso) {
      clearInterval(this.timerProgresso);
    }

    if (this.timerPaginaCurta) {
      clearTimeout(this.timerPaginaCurta);
    }

    // salva o que foi lido antes de sair da página
    if (this.publicacao) {
      this.enviarProgresso(this.publicacao.id);
    }

  }

  urlCapa(capa: string | null): string {
    return this.apiService.urlCapa(capa);
  }

  voltar(): void {
    this.router.navigate(['/']);
  }

}
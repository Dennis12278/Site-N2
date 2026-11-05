import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

interface DiaSemana {
  nome: string;
  numero: number;
  data: Date;
}

interface Feriado {
  data: string;
  nome: string;
}

interface Lembrete {
  id: number;
  data: string;
  horario: string;
  descricao: string;
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css'
})
export class Calendario {

  /* =========================================
     MESES
  ========================================= */

  meses: string[] = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];

  mesSelecionado: number = new Date().getMonth();

  anoAtual: number = new Date().getFullYear();

  anoSelecionado: number = this.anoAtual;


  /* =========================================
     SEMANA
  ========================================= */

  semanaAtual: Date = this.obterInicioSemana(new Date());

  diasSemana: DiaSemana[] = [];


  /* =========================================
     HORÁRIOS
  ========================================= */

  horarios: string[] = [];


  /* =========================================
     LEMBRETES (salvos na API)
  ========================================= */

  lembretes: Lembrete[] = [];

  diaSelecionado: DiaSemana | null = null;

  horarioSelecionado: string = '';

  descricaoLembrete: string = '';

  mostrarLembrete: boolean = false;

  salvando: boolean = false;


  /* =========================================
     CONSTRUTOR
  ========================================= */

  constructor(
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    this.gerarHorarios();

    this.atualizarSemana();

    this.carregarLembretes();

  }


  /* =========================================
     NAVEGAÇÃO
  ========================================= */

  irParaMeuPerfil(): void {
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


  /* =========================================
     CARREGAR LEMBRETES DA API
  ========================================= */

  carregarLembretes(): void {

    const usuario = SessaoService.usuario();

    if (!usuario) {
      return;
    }

    this.apiService.listarCalendario(usuario.id).subscribe({

      next: itens => {

        // a API devolve em UTC; new Date() converte para o horário local
        this.lembretes = itens.map(item => {

          const dataHora = new Date(item.data);

          return {
            id: item.id,
            data: this.formatarData(dataHora),
            horario: dataHora.getHours().toString().padStart(2, '0') + ':00',
            descricao: item.descricao
          };

        });

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {
        console.error('Erro ao carregar calendário:', erro);
      }

    });

  }


  /* =========================================
     GERAR HORÁRIOS
  ========================================= */

  gerarHorarios(): void {

    this.horarios = [];

    for (let hora = 0; hora < 24; hora++) {

      const horario =
        hora.toString().padStart(2, '0') + ':00';

      this.horarios.push(horario);

    }

  }


  /* =========================================
     OBTER INÍCIO DA SEMANA

     Segunda-feira = primeiro dia
  ========================================= */

  obterInicioSemana(data: Date): Date {

    const resultado = new Date(data);

    const dia = resultado.getDay();

    const diferenca =
      dia === 0
        ? -6
        : 1 - dia;

    resultado.setDate(
      resultado.getDate() + diferenca
    );

    resultado.setHours(0, 0, 0, 0);

    return resultado;

  }


  /* =========================================
     ATUALIZAR SEMANA
  ========================================= */

  atualizarSemana(): void {

    this.diasSemana = [];

    const nomes = [
      'SEG',
      'TER',
      'QUA',
      'QUI',
      'SEX',
      'SÁB',
      'DOM'
    ];

    for (let i = 0; i < 7; i++) {

      const data = new Date(this.semanaAtual);

      data.setDate(
        this.semanaAtual.getDate() + i
      );

      this.diasSemana.push({
        nome: nomes[i],
        numero: data.getDate(),
        data: data
      });

    }

  }


  /* =========================================
     SELECIONAR MÊS
  ========================================= */

  selecionarMes(indice: number): void {

    this.mesSelecionado = indice;

    const primeiroDia = new Date(
      this.anoAtual,
      indice,
      1
    );

    this.semanaAtual =
      this.obterInicioSemana(primeiroDia);

    this.atualizarSemana();

  }


  /* =========================================
     SEMANA ANTERIOR
  ========================================= */

  semanaAnterior(): void {

    const novaSemana =
      new Date(this.semanaAtual);

    novaSemana.setDate(
      novaSemana.getDate() - 7
    );

    this.semanaAtual = novaSemana;

    this.atualizarSemana();

    this.atualizarMesSelecionado();

  }


  /* =========================================
     PRÓXIMA SEMANA
  ========================================= */

  proximaSemana(): void {

    const novaSemana =
      new Date(this.semanaAtual);

    novaSemana.setDate(
      novaSemana.getDate() + 7
    );

    this.semanaAtual = novaSemana;

    this.atualizarSemana();

    this.atualizarMesSelecionado();

  }


  /* =========================================
     ATUALIZAR MÊS SELECIONADO
  ========================================= */

  atualizarMesSelecionado(): void {

    const hoje = new Date();

    const primeiraData =
      this.diasSemana[0]?.data;

    const ultimaData =
      this.diasSemana[6]?.data;

    if (!primeiraData || !ultimaData) {
      return;
    }

    const quantidadePorMes: {
      [mes: number]: number
    } = {};

    for (const dia of this.diasSemana) {

      const mes = dia.data.getMonth();

      quantidadePorMes[mes] =
        (quantidadePorMes[mes] || 0) + 1;

    }

    let maiorQuantidade = 0;

    let mesEscolhido =
      hoje.getMonth();

    for (const mes in quantidadePorMes) {

      const quantidade =
        quantidadePorMes[Number(mes)];

      if (quantidade > maiorQuantidade) {

        maiorQuantidade = quantidade;

        mesEscolhido =
          Number(mes);

      }

    }

    this.mesSelecionado =
      mesEscolhido;

  }


  /* =========================================
     IR PARA HOJE
  ========================================= */

  irParaHoje(): void {

    const hoje = new Date();

    this.anoAtual =
      hoje.getFullYear();

    this.mesSelecionado =
      hoje.getMonth();

    this.semanaAtual =
      this.obterInicioSemana(hoje);

    this.atualizarSemana();

  }


  /* =========================================
     VERIFICAR SE É HOJE
  ========================================= */

  ehHoje(data: Date): boolean {

    const hoje = new Date();

    return (
      data.getDate() === hoje.getDate() &&
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear()
    );

  }


  /* =========================================
     FERIADOS NACIONAIS
  ========================================= */

  obterFeriados(ano: number): Feriado[] {

    const feriados: Feriado[] = [

      {
        data: `${ano}-01-01`,
        nome: 'Confraternização Universal'
      },

      {
        data: `${ano}-04-21`,
        nome: 'Tiradentes'
      },

      {
        data: `${ano}-05-01`,
        nome: 'Dia do Trabalho'
      },

      {
        data: `${ano}-09-07`,
        nome: 'Independência do Brasil'
      },

      {
        data: `${ano}-10-12`,
        nome: 'Nossa Senhora Aparecida'
      },

      {
        data: `${ano}-11-02`,
        nome: 'Finados'
      },

      {
        data: `${ano}-11-15`,
        nome: 'Proclamação da República'
      },

      {
        data: `${ano}-11-20`,
        nome: 'Dia da Consciência Negra'
      },

      {
        data: `${ano}-12-25`,
        nome: 'Natal'
      }

    ];

    return feriados;

  }


  /* =========================================
     FORMATO DA DATA (yyyy-mm-dd, horário local)
  ========================================= */

  formatarData(data: Date): string {

    const ano =
      data.getFullYear();

    const mes =
      (data.getMonth() + 1)
        .toString()
        .padStart(2, '0');

    const dia =
      data.getDate()
        .toString()
        .padStart(2, '0');

    return `${ano}-${mes}-${dia}`;

  }


  /* =========================================
     VERIFICAR FERIADO
  ========================================= */

  obterFeriado(data: Date): string | null {

    const dataFormatada =
      this.formatarData(data);

    const feriados =
      this.obterFeriados(
        data.getFullYear()
      );

    const feriado =
      feriados.find(
        item => item.data === dataFormatada
      );

    return feriado
      ? feriado.nome
      : null;

  }


  /* =========================================
     TEXTO DA SEMANA
  ========================================= */

  get textoSemana(): string {

    if (this.diasSemana.length === 0) {
      return '';
    }

    const primeiro =
      this.diasSemana[0].data;

    const ultimo =
      this.diasSemana[6].data;

    const mesesAbreviados = [
      'jan.',
      'fev.',
      'mar.',
      'abr.',
      'mai.',
      'jun.',
      'jul.',
      'ago.',
      'set.',
      'out.',
      'nov.',
      'dez.'
    ];

    if (
      primeiro.getMonth() ===
      ultimo.getMonth()
    ) {

      return `${primeiro.getDate()} a ${ultimo.getDate()} de ${mesesAbreviados[primeiro.getMonth()]} de ${primeiro.getFullYear()}`;

    }

    return `${primeiro.getDate()} de ${mesesAbreviados[primeiro.getMonth()]} a ${ultimo.getDate()} de ${mesesAbreviados[ultimo.getMonth()]} de ${ultimo.getFullYear()}`;

  }


  /* =========================================
     SELECIONAR HORÁRIO
  ========================================= */

  selecionarHorario(
    dia: DiaSemana,
    horario: string
  ): void {

    this.diaSelecionado = dia;

    this.horarioSelecionado = horario;

    const lembrete =
      this.obterLembrete(
        dia,
        horario
      );

    this.descricaoLembrete =
      lembrete ? lembrete : '';

    this.mostrarLembrete = true;

  }


  /* =========================================
     OBTER LEMBRETE (texto, para a grade)
  ========================================= */

  obterLembrete(
    dia: DiaSemana,
    horario: string
  ): string | null {

    const data =
      this.formatarData(dia.data);

    const lembrete =
      this.lembretes.find(item =>
        item.data === data &&
        item.horario === horario
      );

    return lembrete
      ? lembrete.descricao
      : null;

  }


  /* =========================================
     SALVAR LEMBRETE (cria ou edita na API)
  ========================================= */

  salvarLembrete(): void {

    if (
      !this.diaSelecionado ||
      !this.horarioSelecionado ||
      this.salvando
    ) {
      return;
    }

    const usuario = SessaoService.usuario();

    if (!usuario) {
      return;
    }

    const data =
      this.formatarData(this.diaSelecionado.data);

    const existente =
      this.lembretes.find(item =>
        item.data === data &&
        item.horario === this.horarioSelecionado
      );

    const descricao =
      this.descricaoLembrete.trim();

    // texto vazio apaga o lembrete que já existia
    if (descricao === '') {

      if (existente) {
        this.excluirLembrete();
      } else {
        this.fecharLembrete();
      }

      return;

    }

    // data e hora juntas, convertidas para UTC (mesmo padrão dos documentos)
    const dataHora = new Date(this.diaSelecionado.data);

    dataHora.setHours(
      Number(this.horarioSelecionado.substring(0, 2)),
      0,
      0,
      0
    );

    this.salvando = true;

    if (existente) {

      this.apiService.editarCalendario({
        id: existente.id,
        idUsuario: usuario.id,
        data: dataHora.toISOString(),
        descricao: descricao
      }).subscribe({

        next: () => {

          existente.descricao = descricao;

          this.concluirSalvar();

        },

        error: erro => this.falharSalvar(erro)

      });

      return;

    }

    this.apiService.criarCalendario({
      idUsuario: usuario.id,
      data: dataHora.toISOString(),
      descricao: descricao
    }).subscribe({

      next: (criado: any) => {

        this.lembretes.push({
          id: criado.id,
          data: data,
          horario: this.horarioSelecionado,
          descricao: descricao
        });

        this.concluirSalvar();

      },

      error: erro => this.falharSalvar(erro)

    });

  }


  /* =========================================
     EXCLUIR LEMBRETE (na API)
  ========================================= */

  excluirLembrete(): void {

    if (
      !this.diaSelecionado ||
      !this.horarioSelecionado ||
      this.salvando
    ) {
      return;
    }

    const data =
      this.formatarData(this.diaSelecionado.data);

    const existente =
      this.lembretes.find(item =>
        item.data === data &&
        item.horario === this.horarioSelecionado
      );

    if (!existente) {
      this.fecharLembrete();
      return;
    }

    this.salvando = true;

    this.apiService.excluirCalendario(existente.id).subscribe({

      next: () => {

        this.lembretes =
          this.lembretes.filter(item => item !== existente);

        this.concluirSalvar();

      },

      error: erro => this.falharSalvar(erro)

    });

  }


  /* =========================================
     CONCLUIR / FALHAR SALVAR
  ========================================= */

  private concluirSalvar(): void {

    this.salvando = false;

    this.fecharLembrete();

    this.changeDetectorRef.detectChanges();

  }

  private falharSalvar(erro: any): void {

    console.error('Erro ao salvar lembrete:', erro);

    this.salvando = false;

    alert('Não foi possível salvar o lembrete. Verifique se a API está rodando.');

    this.changeDetectorRef.detectChanges();

  }
  
  /* =========================================
     FECHAR LEMBRETE
  ========================================= */

  fecharLembrete(): void {

    this.mostrarLembrete = false;

    this.diaSelecionado = null;

    this.horarioSelecionado = '';

    this.descricaoLembrete = '';

  }

}
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

interface ItemColecao {
  id: number;
  titulo: string;
  capa: string | null;
  dataPublicacao: string | null;
}

@Component({
  selector: 'app-nova-colecao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './nova-colecao.html',
  styleUrl: './nova-colecao.css'
})
export class NovaColecao implements OnInit {

  idColecao: number | null = null;

  nome = '';
  descricao = '';
  visibilidade = 'publica';

  // pesquisa de títulos publicados
  pesquisa = '';

  itens: ItemColecao[] = [];

  publicacoes: ItemColecao[] = [];

  carregando = false;

  salvando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  get modoEdicao(): boolean {
    return this.idColecao !== null;
  }

  get resultadosPesquisa(): ItemColecao[] {

    const texto = this.pesquisa.trim().toLowerCase();

    if (texto === '') {
      return [];
    }

    const jaAdicionados = new Set(this.itens.map(i => i.id));

    return this.publicacoes
      .filter(p => !jaAdicionados.has(p.id) && p.titulo.toLowerCase().includes(texto))
      .slice(0, 8);

  }

  ngOnInit(): void {

    this.carregarPublicacoes();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.idColecao = Number(id);
      this.carregarColecao(this.idColecao);
    }

  }

  carregarPublicacoes(): void {

    this.apiService.listarDocumentos(true).subscribe({

      next: documentos => {

        this.publicacoes = documentos.map(d => ({
          id: d.id,
          titulo: d.titulo,
          capa: d.capa ?? null,
          dataPublicacao: d.dataPublicacao ?? null
        }));

        this.changeDetectorRef.detectChanges();

      },

      error: erro => console.error('Erro ao buscar publicações:', erro)

    });

  }

  carregarColecao(id: number): void {

    const usuario = SessaoService.usuario();

    this.carregando = true;

    this.apiService.obterColecaoPublica(id, usuario ? usuario.id : 0).subscribe({

      next: colecao => {

        if (!usuario || colecao.idUsuario !== usuario.id) {
          alert('Você não pode editar esta coleção.');
          this.router.navigate(['/colecao', id]);
          return;
        }

        this.nome = colecao.titulo;
        this.descricao = colecao.descricao ?? '';
        this.visibilidade = colecao.visibilidade;

        this.itens = (colecao.itens ?? []).map((i: any) => ({
          id: i.id,
          titulo: i.titulo,
          capa: i.capa ?? null,
          dataPublicacao: i.dataPublicacao ?? null
        }));

        this.carregando = false;
        this.changeDetectorRef.detectChanges();

      },

      error: erro => {

        console.error('Erro ao carregar coleção:', erro);

        this.carregando = false;
        this.router.navigate(['/colecoes']);

      }

    });

  }

  adicionarItem(publicacao: ItemColecao): void {

    if (this.itens.some(i => i.id === publicacao.id)) {
      return;
    }

    this.itens.push({ ...publicacao });
    this.pesquisa = '';

  }

  removerItem(index: number): void {
    this.itens.splice(index, 1);
  }

  moverItem(index: number, direcao: number): void {

    const novo = index + direcao;

    if (novo < 0 || novo >= this.itens.length) {
      return;
    }

    const temp = this.itens[index];
    this.itens[index] = this.itens[novo];
    this.itens[novo] = temp;

  }

  criarColecao(): void {

    const usuario = SessaoService.usuario();

    if (!usuario || this.salvando) {
      return;
    }

    if (this.nome.trim() === '') {
      alert('Digite o nome da coleção.');
      return;
    }

    this.salvando = true;

    const dados = {
      idUsuario: usuario.id,
      titulo: this.nome.trim(),
      descricao: this.descricao.trim(),
      visibilidade: this.visibilidade
    };

    if (this.idColecao === null) {

      this.apiService.criarColecaoPublica(dados).subscribe({
        next: resposta => this.salvarItens(resposta.id, usuario.id),
        error: erro => this.falhar(erro)
      });

      return;

    }

    const id = this.idColecao;

    this.apiService.atualizarColecaoPublica(id, dados).subscribe({
      next: () => this.salvarItens(id, usuario.id),
      error: erro => this.falhar(erro)
    });

  }

  private salvarItens(id: number, idUsuario: number): void {

    const ids = this.itens.map(i => i.id);

    this.apiService.salvarItensColecao(id, idUsuario, ids).subscribe({

      next: () => {
        this.salvando = false;
        this.router.navigate(['/colecao', id]);
      },

      error: erro => this.falhar(erro)

    });

  }

  private falhar(erro: any): void {

    console.error('Erro ao salvar coleção:', erro);

    this.salvando = false;

    alert('Não foi possível salvar a coleção.');

    this.changeDetectorRef.detectChanges();

  }

  cancelar(): void {

    if (this.idColecao !== null) {
      this.router.navigate(['/colecao', this.idColecao]);
    } else {
      this.router.navigate(['/colecoes']);
    }

  }

  voltar(): void {
    this.cancelar();
  }

  urlCapa(capa: string | null): string {
    return this.apiService.urlCapa(capa);
  }

  tempoAtras(data: string | null): string {

    if (!data) {
      return '';
    }

    const minutos = Math.floor((Date.now() - new Date(data).getTime()) / 60000);

    if (minutos < 60) {
      return minutos < 1 ? 'agora' : minutos + ' min atrás';
    }

    const horas = Math.floor(minutos / 60);

    if (horas < 24) {
      return horas + (horas === 1 ? ' hora atrás' : ' horas atrás');
    }

    const dias = Math.floor(horas / 24);

    return dias + (dias === 1 ? ' dia atrás' : ' dias atrás');

  }

}
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

@Component({
  selector: 'app-colecao-detalhe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './colecao-detalhe.html',
  styleUrl: './colecao-detalhe.css'
})
export class ColecaoDetalhe implements OnInit {

  colecao: any = null;

  carregando = true;

  naoEncontrada = false;

  curtindo = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.naoEncontrada = true;
      this.carregando = false;
      return;
    }

    this.carregar(id);

  }

  carregar(id: number): void {

    const usuario = SessaoService.usuario();

    this.apiService.obterColecaoPublica(id, usuario ? usuario.id : 0).subscribe({

      next: colecao => {

        this.colecao = colecao;
        this.carregando = false;

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {

        console.error('Erro ao carregar coleção:', erro);

        this.naoEncontrada = true;
        this.carregando = false;

        this.changeDetectorRef.detectChanges();

      }

    });

  }

  descricaoExpandida = false;

  get descricaoLonga(): boolean {
    return (this.colecao?.descricao ?? '').length > 280;
  }

  alternarDescricao(): void {
    this.descricaoExpandida = !this.descricaoExpandida;
  }

  // até 3 capas dos primeiros títulos, para o mosaico da capa
  get capasMosaico(): string[] {
    return (this.colecao?.itens ?? [])
      .map((i: any) => i.capa)
      .filter((c: string | null) => !!c)
      .slice(0, 3);
  }

  get textoTitulos(): string {
    const total = this.colecao?.itens?.length ?? 0;
    return total + (total === 1 ? ' título' : ' títulos');
  }

  get souDono(): boolean {

    const usuario = SessaoService.usuario();

    return !!usuario && !!this.colecao && usuario.id === this.colecao.idUsuario;

  }

  get inicialDono(): string {
    return (this.colecao?.nomeUsuario || '?').charAt(0).toUpperCase();
  }

  curtir(): void {

    const usuario = SessaoService.usuario();

    if (!usuario || this.curtindo) {
      return;
    }

    this.curtindo = true;

    this.apiService.curtirColecao(this.colecao.id, usuario.id).subscribe({

      next: resposta => {

        this.colecao.curtiu = resposta.curtiu;
        this.colecao.curtidas += resposta.curtiu ? 1 : -1;
        this.curtindo = false;

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {

        console.error('Erro ao curtir coleção:', erro);

        this.curtindo = false;

      }

    });

  }

  editar(): void {
    this.router.navigate(['/colecao', this.colecao.id, 'editar']);
  }

  abrirItem(item: any): void {
    this.router.navigate(['/publicacao', item.id]);
  }

  voltar(): void {
    this.router.navigate(['/']);
  }

  urlCapa(capa: string | null): string {
    return this.apiService.urlCapa(capa);
  }

  tempoAtras(data: string | null): string {

    if (!data) {
      return '';
    }

    const minutos = Math.floor((Date.now() - new Date(data).getTime()) / 60000);

    if (minutos < 1) {
      return 'agora';
    }

    if (minutos < 60) {
      return minutos + (minutos === 1 ? ' minuto atrás' : ' minutos atrás');
    }

    const horas = Math.floor(minutos / 60);

    if (horas < 24) {
      return horas + (horas === 1 ? ' hora atrás' : ' horas atrás');
    }

    const dias = Math.floor(horas / 24);

    return dias + (dias === 1 ? ' dia atrás' : ' dias atrás');

  }

}
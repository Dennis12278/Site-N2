import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

interface TituloSeguido {
  id: number;
  titulo: string;
  capa: string | null;
  marcador: string;
  dataPublicacao: string | null;
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
export class TitulosSeguidos implements OnInit {

  titulos: TituloSeguido[] = [];

  carregando = false;

  abaAtiva = 'todos';

  pesquisa = '';

  ordenacao = 'recentes';

  readonly abas = [
    { valor: 'todos', texto: 'Todos' },
    { valor: 'lendo', texto: 'Lendo' },
    { valor: 'quero-ler', texto: 'Quero ler' },
    { valor: 'concluido', texto: 'Concluído' },
    { valor: 'pausado', texto: 'Em pausa' },
    { valor: 'abandonado', texto: 'Abandonado' }
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {

    const usuario = SessaoService.usuario();

    if (!usuario) {
      return;
    }

    this.carregando = true;

    this.apiService.listarTitulosSeguidos(usuario.id).subscribe({

      next: itens => {

        this.titulos = itens.map(item => ({
          id: item.id,
          titulo: item.titulo,
          capa: item.capa ?? null,
          marcador: item.marcador,
          dataPublicacao: item.dataPublicacao ?? null
        }));

        this.carregando = false;
        this.changeDetectorRef.detectChanges();

      },

      error: erro => {

        console.error('Erro ao buscar títulos seguidos:', erro);

        this.carregando = false;
        this.changeDetectorRef.detectChanges();

      }

    });

  }

  contar(valor: string): number {

    if (valor === 'todos') {
      return this.titulos.length;
    }

    return this.titulos.filter(t => t.marcador === valor).length;

  }

  nomeMarcador(valor: string): string {

    const aba = this.abas.find(a => a.valor === valor);

    return aba ? aba.texto : valor;

  }

  get titulosFiltrados(): TituloSeguido[] {

    let lista = [...this.titulos];

    if (this.abaAtiva !== 'todos') {
      lista = lista.filter(t => t.marcador === this.abaAtiva);
    }

    const texto = this.pesquisa.trim().toLowerCase();

    if (texto !== '') {
      lista = lista.filter(t => t.titulo.toLowerCase().includes(texto));
    }

    if (this.ordenacao === 'titulo') {
      lista.sort((a, b) => a.titulo.localeCompare(b.titulo));
    }

    return lista;

  }

  selecionarAba(valor: string): void {
    this.abaAtiva = valor;
  }

  abrirTitulo(titulo: TituloSeguido): void {
    this.router.navigate(['/publicacao', titulo.id]);
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

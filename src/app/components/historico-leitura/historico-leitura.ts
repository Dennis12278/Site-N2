import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

interface Leitura {
  id: number;
  idDocumento: number;
  titulo: string;
  capa: string;
  lidoHa: string;
  progresso: number;
}

@Component({
  selector: 'app-historico-leitura',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent
  ],
  templateUrl: './historico-leitura.html',
  styleUrl: './historico-leitura.css'
})
export class HistoricoLeitura {

  leituras: Leitura[] = [];

  paginaAtual: number = 0;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.carregarHistorico();
  }


  /* =========================================
     CARREGAR HISTÓRICO DA API
  ========================================= */

  carregarHistorico(): void {

    const usuario = SessaoService.usuario();

    if (!usuario) {
      return;
    }

    this.apiService.listarHistorico(usuario.id).subscribe({

      next: itens => {

        this.leituras = itens.map(item => ({
          id: item.id,
          idDocumento: item.idDocumento,
          titulo: item.titulo,
          capa: item.capa ?? '',
          lidoHa: this.tempoAtras(item.dataUltimaLeitura),
          progresso: item.progresso
        }));

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {
        console.error('Erro ao buscar histórico:', erro);
      }

    });

  }


  /* =========================================
     TEMPO ATRÁS (ex.: "3 horas atrás")
  ========================================= */

  tempoAtras(data: string): string {

    const minutos = Math.floor(
      (Date.now() - new Date(data).getTime()) / 60000
    );

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


  urlCapa(capa: string | null): string {
    return this.apiService.urlCapa(capa);
  }


  /* =========================================
     NAVEGAÇÃO DO HISTÓRICO
  ========================================= */

  paginaAnterior(): void {

    if (this.paginaAtual > 0) {
      this.paginaAtual--;
    }

  }

  proximaPagina(): void {
    this.paginaAtual++;
  }

  abrirMenu(): void {
    console.log('Menu do histórico');
  }


  /* =========================================
     ABRIR A PUBLICAÇÃO LIDA
  ========================================= */

  abrirLeitura(leitura: Leitura): void {

    this.router.navigate(['/publicacao', leitura.idDocumento]);

  }

}

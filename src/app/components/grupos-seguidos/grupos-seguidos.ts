import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

interface GrupoSeguido {
  id: number;
  idGrupo: number;
  nome: string;
  descricao: string;
  iniciais: string;
}

@Component({
  selector: 'app-grupos-seguidos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './grupos-seguidos.html',
  styleUrl: './grupos-seguidos.css'
})
export class GruposSeguidos {

  pesquisa: string = '';

  ordenacao: string = 'Recentes';

  grupos: GrupoSeguido[] = [];

  constructor(
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.carregarGrupos();
  }


  /* =========================================
     CARREGAR GRUPOS DA API
  ========================================= */

  carregarGrupos(): void {

    const usuario = SessaoService.usuario();

    if (!usuario) {
      return;
    }

    this.apiService.listarGruposSeguidos(usuario.id).subscribe({

      next: itens => {

        this.grupos = itens.map(item => ({
          id: item.id,
          idGrupo: item.idGrupo,
          nome: item.nome,
          descricao: item.descricao ?? '',
          iniciais: this.gerarIniciais(item.nome)
        }));

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {
        console.error('Erro ao buscar grupos seguidos:', erro);
      }

    });

  }


  /* =========================================
     INICIAIS DO NOME (ex.: "Temple Scan" -> "TS")
  ========================================= */

  gerarIniciais(nome: string): string {

    return nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(palavra => palavra.charAt(0).toUpperCase())
      .join('');

  }


  /* =========================================
     ORDENAÇÃO
  ========================================= */

  selecionarOrdenacao(tipo: string): void {

    this.ordenacao = tipo;

  }


  /* =========================================
     GRUPOS FILTRADOS
  ========================================= */

  get gruposFiltrados(): GrupoSeguido[] {

    let resultado = [...this.grupos];

    if (this.pesquisa.trim() !== '') {

      const texto = this.pesquisa.toLowerCase().trim();

      resultado = resultado.filter(grupo =>
        grupo.nome.toLowerCase().includes(texto)
      );

    }

    if (this.ordenacao === 'A-Z') {

      resultado.sort((a, b) =>
        a.nome.localeCompare(b.nome)
      );

    }

    return resultado;

  }


  /* =========================================
     DEIXAR DE SEGUIR (remove na API)
  ========================================= */

  deixarDeSeguir(grupo: GrupoSeguido): void {

    const confirmar =
      confirm(`Deseja deixar de seguir o grupo ${grupo.nome}?`);

    if (!confirmar) {
      return;
    }

    this.apiService.deixarDeSeguirGrupo(grupo.id).subscribe({

      next: () => {

        this.grupos = this.grupos.filter(item => item !== grupo);

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {

        console.error('Erro ao deixar de seguir grupo:', erro);

        alert('Não foi possível deixar de seguir o grupo.');

      }

    });

  }

}
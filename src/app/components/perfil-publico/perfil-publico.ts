import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

@Component({
  selector: 'app-perfil-publico',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './perfil-publico.html',
  styleUrl: './perfil-publico.css'
})
export class PerfilPublico implements OnInit {

  nome = '';
  biografia = '';
  links = '';
  avatarUrl: string | null = null;

  titulos = 0;
  publicacoes = 0;
  colecoes = 0;
  grupos = 0;

  carregando = false;

  constructor(
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {

    const usuario = SessaoService.usuario();

    if (!usuario) {
      return;
    }

    this.carregando = true;

    this.apiService.obterPerfilPublico(usuario.id).subscribe({

      next: perfil => {

        this.nome = perfil.nome;
        this.biografia = perfil.biografia ?? '';
        this.links = perfil.links ?? '';
        this.avatarUrl = perfil.avatar ?? null;

        this.titulos = perfil.titulos;
        this.publicacoes = perfil.publicacoes;
        this.colecoes = perfil.colecoes;
        this.grupos = perfil.grupos;

        this.carregando = false;
        this.changeDetectorRef.detectChanges();

      },

      error: erro => {

        console.error('Erro ao carregar perfil público:', erro);

        this.carregando = false;
        this.changeDetectorRef.detectChanges();

      }

    });

  }

  get arroba(): string {
    return '@' + this.nome.toLowerCase().replace(/\s+/g, '');
  }

  get listaLinks(): string[] {
    return this.links
      .split('\n')
      .map(l => l.trim())
      .filter(l => l !== '');
  }

}
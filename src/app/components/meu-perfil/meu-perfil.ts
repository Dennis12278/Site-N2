import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

// tamanho máximo da foto (2 MB)
const TAMANHO_MAXIMO_AVATAR = 2 * 1024 * 1024;

@Component({
  selector: 'app-meu-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './meu-perfil.html',
  styleUrl: './meu-perfil.css',
})
export class MeuPerfil implements OnInit {

  avatarUrl: string | null = null;

  // foto escolhida agora (ainda não salva); null = não mudou
  novoAvatar: string | null = null;

  // true = o usuário clicou em remover a foto
  removerAvatar = false;

  nome = '';
  email = '';
  biografia = '';
  links = '';

  titulos = 0;
  grupos = 0;
  colecoes = 0;
  publicacoes = 0;

  salvando = false;

  constructor(
    private router: Router,
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

    this.apiService.obterMeuPerfil(usuario.id).subscribe({

      next: perfil => {

        this.nome = perfil.nome;
        this.email = perfil.email;
        this.biografia = perfil.biografia ?? '';
        this.links = perfil.links ?? '';
        this.avatarUrl = perfil.avatar ?? null;

        this.titulos = perfil.titulos;
        this.grupos = perfil.grupos;
        this.colecoes = perfil.colecoes;
        this.publicacoes = perfil.publicacoes;

        this.changeDetectorRef.detectChanges();

      },

      error: erro => {
        console.error('Erro ao carregar perfil:', erro);
      }

    });

  }

  get arroba(): string {
    return '@' + this.nome.toLowerCase().replace(/\s+/g, '');
  }

  get inicial(): string {
    return (this.nome || '?').charAt(0).toUpperCase();
  }

  selecionarAvatar(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const arquivo = input.files[0];

    if (!arquivo.type.startsWith('image/')) {
      alert('Escolha um arquivo de imagem.');
      return;
    }

    if (arquivo.size > TAMANHO_MAXIMO_AVATAR) {
      alert('A foto precisa ter no máximo 2 MB.');
      input.value = '';
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      this.novoAvatar = leitor.result as string;
      this.avatarUrl = this.novoAvatar;
      this.removerAvatar = false;
      this.changeDetectorRef.detectChanges();
    };

    leitor.readAsDataURL(arquivo);

  }

  retirarAvatar(): void {
    this.novoAvatar = null;
    this.avatarUrl = null;
    this.removerAvatar = true;
  }

  salvar(): void {

    const usuario = SessaoService.usuario();

    if (!usuario || this.salvando) {
      return;
    }

    if (this.nome.trim() === '') {
      alert('Informe o nome de exibição.');
      return;
    }

    if (!this.email.includes('@')) {
      alert('Informe um e-mail válido.');
      return;
    }

    // undefined = não envia a foto (mantém a atual)
    let avatar: string | undefined;

    if (this.removerAvatar) {
      avatar = '';
    } else if (this.novoAvatar) {
      avatar = this.novoAvatar;
    }

    this.salvando = true;

    this.apiService.salvarPerfil(usuario.id, {
      nome: this.nome.trim(),
      email: this.email.trim(),
      biografia: this.biografia,
      links: this.links,
      avatar: avatar
    }).subscribe({

      next: () => {

        SessaoService.entrar({
          id: usuario.id,
          nome: this.nome.trim(),
          email: this.email.trim()
        });

        this.novoAvatar = null;
        this.removerAvatar = false;
        this.salvando = false;

        alert('Perfil salvo com sucesso!');
        this.changeDetectorRef.detectChanges();

      },

      error: erro => {

        console.error('Erro ao salvar perfil:', erro);

        this.salvando = false;
        alert('Não foi possível salvar o perfil. Verifique se a foto não é muito grande.');
        this.changeDetectorRef.detectChanges();

      }

    });

  }

}
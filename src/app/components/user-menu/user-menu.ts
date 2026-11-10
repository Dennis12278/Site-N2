import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SessaoService, UsuarioSessao } from '../../services/sessao.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css'
})
export class UserMenuComponent implements OnInit {

  @Output() fecharMenu = new EventEmitter<void>();

  usuario: UsuarioSessao | null = SessaoService.usuario();

  // foto do usuário (null = mostra o ícone padrão)
  avatarUrl: string | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    if (!this.usuario) {
      return;
    }

    this.apiService.obterMeuPerfil(this.usuario.id).subscribe({

      next: perfil => {
        this.avatarUrl = perfil.avatar ?? null;
        this.changeDetectorRef.detectChanges();
      },

      error: () => {
        this.avatarUrl = null;
      }

    });

  }

  // ==============================
  // FECHAR MENU
  // ==============================
  fechar(): void {
    this.fecharMenu.emit();
  }

  // ==============================
  // NAVEGAR (fecha o menu e abre a rota)
  // ==============================
  private irPara(rota: string): void {
    this.fecharMenu.emit();
    this.router.navigate([rota]);
  }

  // ==============================
  // SAIR
  // ==============================
  sair(): void {
    this.fecharMenu.emit();
    SessaoService.sair();
    this.router.navigate(['/login']);
  }

  irParaMeuPerfil(): void {
    this.irPara('/meu-perfil');
  }

  irParaPerfilPublico(): void {
    this.irPara('/perfil-publico');
  }

  irParaTitulosSeguidos(): void {
    this.irPara('/titulos-seguidos');
  }

  irParaGruposSeguidos(): void {
    this.irPara('/grupos-seguidos');
  }

  irParaHistorico(): void {
    this.irPara('/historico-leitura');
  }

  irParaColecoes(): void {
    this.irPara('/colecoes');
  }

  irParaNotificacoes(): void {
    this.irPara('/notificacoes');
  }

  irParaMinhasPublicacoes(): void {
    this.irPara('/minhas-publicacoes');
  }

  irParaConfiguracoes(): void {
    this.irPara('/configuracoes');
  }
}
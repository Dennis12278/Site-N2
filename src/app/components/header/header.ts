import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserMenuComponent } from '../user-menu/user-menu';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    UserMenuComponent
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {

  userMenuOpen = false;

  // foto do usuário (null = mostra o ícone padrão)
  avatarUrl: string | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {

    this.carregarAvatar();

    // recarrega a foto ao trocar de tela (assim, depois de salvar o perfil, o cabeçalho atualiza)
    this.router.events
      .pipe(filter(evento => evento instanceof NavigationEnd))
      .subscribe(() => this.carregarAvatar());

  }

  carregarAvatar(): void {

    const usuario = SessaoService.usuario();

    if (!usuario) {
      this.avatarUrl = null;
      return;
    }

    this.apiService.obterMeuPerfil(usuario.id).subscribe({

      next: perfil => {
        this.avatarUrl = perfil.avatar ?? null;
      },

      error: () => {
        this.avatarUrl = null;
      }

    });

  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  fecharUserMenu(): void {
    this.userMenuOpen = false;
  }

  irParaInicio(): void {
    this.router.navigate(['/']);
  }

  irParaCalendario(): void {
    this.router.navigate(['/calendario']);
  }
}
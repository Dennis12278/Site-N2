import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserMenuComponent } from '../user-menu/user-menu';

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
export class HeaderComponent {

  userMenuOpen = false;

  constructor(private router: Router) {}

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
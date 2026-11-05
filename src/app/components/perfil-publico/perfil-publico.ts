import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-perfil-publico',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './perfil-publico.html',
  styleUrl: './perfil-publico.css'
})
export class PerfilPublico {

}

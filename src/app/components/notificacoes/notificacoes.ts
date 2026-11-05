import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent
  ],
  templateUrl: './notificacoes.html',
  styleUrl: './notificacoes.css'
})
export class Notificacoes implements OnInit {

  notificacoes: any[] = [];

  constructor(
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.carregarNotificacoes();
  }

  carregarNotificacoes(): void {

    this.apiService.listarNotificacoes().subscribe({
      next: notificacoes => {
        this.notificacoes = notificacoes;
      },

      error: erro => {
        console.error('Erro ao buscar notificações:', erro);
      }
    });

  }

  marcarComoLida(id: number): void {

    this.apiService.lerNotificacao(id).subscribe({
      next: () => {
        const notificacao = this.notificacoes.find(
          item => item.id === id
        );

        if (notificacao) {
          notificacao.status = 'lida';
        }
      },

      error: erro => {
        console.error('Erro ao marcar notificação:', erro);
      }
    });

  }

}

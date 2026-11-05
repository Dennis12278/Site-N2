import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

@Component({
  selector: 'app-minhas-publicacoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './minhas-publicacoes.html',
  styleUrl: './minhas-publicacoes.css'
})
export class MinhasPublicacoes implements OnInit {

  tipoSelecionado = 'Todos';

  statusSelecionado = 'Todos';

  publicacoes: any[] = [];

  publicacaoSelecionada: any = null;

  excluindo = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {

    const publicacao = history.state.publicacao;

    if (publicacao) {
      this.publicacaoSelecionada = publicacao;
    }

    this.carregarPublicacoes();
  }

  carregarPublicacoes(): void {

    // por enquanto o usuário é fixo (ainda não existe login)
    this.apiService.listarDocumentosDoUsuario(SessaoService.idUsuario()).subscribe({
      next: documentos => {
        this.publicacoes = documentos;

        this.changeDetectorRef.detectChanges();
      },

      error: erro => {
        console.error('Erro ao buscar publicações:', erro);
      }
    });
  }

  abrirTipo(): void {
    console.log('Tipo selecionado:', this.tipoSelecionado);
  }

  abrirStatus(): void {
    console.log('Status selecionado:', this.statusSelecionado);
  }

  criarPublicacao(): void {
    this.router.navigate(['/criar-publicacao']);
  }

  abrirPublicacao(publicacao: any): void {
    this.router.navigate(['/publicacao', publicacao.id]);
  }

  editarPublicacao(publicacao: any, event: Event): void {

    // impede que o clique no lápis também abra a publicação
    event.stopPropagation();

    this.router.navigate(['/editar-publicacao', publicacao.id]);
  }

  voltarParaPublicacoes(): void {
    this.publicacaoSelecionada = null;
  }

  excluirPublicacao(publicacao: any, event: Event): void {

    // impede que o clique no botão também abra a publicação
    event.stopPropagation();

    if (this.excluindo) {
      return;
    }

    const confirmou = confirm(
      'Excluir "' + publicacao.titulo + '"? Essa ação não pode ser desfeita.'
    );

    if (!confirmou) {
      return;
    }

    this.excluindo = true;

    this.apiService.excluirDocumento(publicacao.id).subscribe({
      next: () => {
        this.publicacoes = this.publicacoes.filter(
          item => item.id !== publicacao.id
        );

        this.excluindo = false;

        this.changeDetectorRef.detectChanges();
      },

      error: erro => {
        console.error('Erro ao excluir publicação:', erro);

        this.excluindo = false;

        alert('Não foi possível excluir a publicação.');

        this.changeDetectorRef.detectChanges();
      }
    });
  }

}
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SessaoService } from '../../services/sessao.service';

@Component({
  selector: 'app-criar-publicacao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './criar-publicacao.html',
  styleUrl: './criar-publicacao.css'
})
export class CriarPublicacao implements OnInit {

  titulo = '';
  descricao = '';
  visibilidade = 'publica';

  arquivoSelecionado: File | null = null;
  capaSelecionada: File | null = null;

  capaPreview = '';
  enviando = false;

  // usados só na edição
  idEdicao: number | null = null;
  capaAtual: string | null = null;
  removerCapa = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  get modoEdicao(): boolean {
    return this.idEdicao !== null;
  }

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      return;
    }

    this.idEdicao = id;

    this.apiService.obterDocumento(id).subscribe({
      next: documento => {
        this.titulo = documento.titulo;
        this.descricao = documento.conteudo ?? '';
        this.visibilidade = documento.visibilidade ?? 'publica';
        this.capaAtual = documento.capa ?? null;

        this.atualizarPreview();

        this.changeDetectorRef.detectChanges();
      },

      error: erro => {
        console.error('Erro ao buscar publicação:', erro);

        alert('Não foi possível carregar a publicação.');

        this.router.navigate(['/minhas-publicacoes']);
      }
    });
  }

  private atualizarPreview(): void {

    if (this.capaSelecionada) {
      this.capaPreview = URL.createObjectURL(this.capaSelecionada);

    } else if (this.capaAtual && !this.removerCapa) {
      this.capaPreview = this.apiService.urlCapa(this.capaAtual);

    } else if (this.arquivoSelecionado?.type.startsWith('image/')) {
      this.capaPreview = URL.createObjectURL(this.arquivoSelecionado);

    } else {
      this.capaPreview = '';
    }
  }

  selecionarArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.arquivoSelecionado = input.files[0];

      this.atualizarPreview();
    }
  }

  escolherCapa(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.capaSelecionada = input.files[0];
      this.removerCapa = false;

      this.atualizarPreview();
    }
  }

  removerCapaEscolhida(): void {
    this.capaSelecionada = null;

    this.atualizarPreview();
  }

  removerCapaAtual(): void {
    this.removerCapa = true;

    this.atualizarPreview();
  }

  publicar(): void {

    if (this.enviando) {
      return;
    }

    if (this.titulo.trim() === '') {
      alert('Digite um título para a publicação.');
      return;
    }

    this.enviando = true;

    const formulario = new FormData();

    formulario.append('titulo', this.titulo.trim());
    formulario.append('conteudo', this.descricao);
    formulario.append('visibilidade', this.visibilidade);

    if (this.capaSelecionada) {
      formulario.append('capa', this.capaSelecionada);
    }

    if (this.idEdicao !== null) {
      formulario.append('removerCapa', String(this.removerCapa));

      this.atualizarDocumento(this.idEdicao, formulario);

      return;
    }

    formulario.append('idUsuario', String(SessaoService.idUsuario()));
    formulario.append('idTipoDocumento', '1');

    this.salvarDocumento(formulario);
  }

  salvarDocumento(documento: FormData): void {

    this.apiService.criarDocumento(documento).subscribe({
      next: () => {
        alert('Publicação criada com sucesso!');

        this.router.navigate(['/minhas-publicacoes']);
      },

      error: erro => {
        console.error('Erro ao criar publicação:', erro);

        this.enviando = false;

        alert('Não foi possível criar a publicação.');

        this.changeDetectorRef.detectChanges();
      }
    });
  }

  atualizarDocumento(id: number, documento: FormData): void {

    this.apiService.editarDocumento(id, documento).subscribe({
      next: () => {
        alert('Publicação atualizada com sucesso!');

        this.router.navigate(['/minhas-publicacoes']);
      },

      error: erro => {
        console.error('Erro ao atualizar publicação:', erro);

        this.enviando = false;

        alert('Não foi possível atualizar a publicação.');

        this.changeDetectorRef.detectChanges();
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/minhas-publicacoes']);
  }
}
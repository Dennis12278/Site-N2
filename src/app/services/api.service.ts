import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5031';

  constructor(private http: HttpClient) {
  }

  /* =========================================
     PUBLICAÇÕES
  ========================================= */

  listarDocumentos(publicado?: boolean) {
    const filtro = publicado === undefined ? '' : '?publicado=' + publicado;
    return this.http.get<any[]>(this.apiUrl + '/Documento' + filtro);
  }

  criarDocumento(documento: FormData) {
    return this.http.post(this.apiUrl + '/Documento', documento);
  }

  editarDocumento(id: number, documento: FormData) {
    return this.http.put(this.apiUrl + '/Documento/' + id, documento);
  }

  obterDocumento(id: number) {
    return this.http.get<any>(this.apiUrl + '/Documento/' + id);
  }

  listarDocumentosDoUsuario(idUsuario: number) {
    return this.http.get<any[]>(this.apiUrl + '/Documento?idUsuario=' + idUsuario);
  }

  excluirDocumento(id: number) {
    return this.http.delete(this.apiUrl + '/Documento/' + id);
  }

  urlCapa(capa: string | null): string {
    if (!capa) {
      return '';
    }

    if (capa.startsWith('data:')) {
      return capa;
    }

    return this.apiUrl + capa;
  }

  /* =========================================
     AUTENTICAÇÃO
  ========================================= */

  cadastrar(dados: { nome: string; email: string; senha: string }) {
    return this.http.post<any>(this.apiUrl + '/Auth/Cadastrar', dados);
  }

  login(dados: { email: string; senha: string }) {
    return this.http.post<any>(this.apiUrl + '/Auth/Login', dados);
  }

  /* =========================================
     NOTIFICAÇÕES
  ========================================= */

  listarNotificacoes() {
    return this.http.get<any[]>(this.apiUrl + '/Notificacao');
  }

  lerNotificacao(id: number) {
    return this.http.put(
      this.apiUrl + '/Notificacao/Ler/' + id,
      {}
    );
  }

  /* =========================================
     COLEÇÕES
  ========================================= */

  listarColecoes() {
    return this.http.get<any[]>(
      this.apiUrl + '/Colecao'
    );
  }

  criarColecao(colecao: any) {
    return this.http.post(
      this.apiUrl + '/Colecao',
      colecao
    );
  }

  editarColecao(colecao: any) {
    return this.http.put(
      this.apiUrl + '/Colecao',
      colecao
    );
  }

  excluirColecao(id: number) {
    return this.http.delete(
      this.apiUrl + '/Colecao/' + id
    );
  }

  listarColecoesPublicas(idUsuario: number) {
    return this.http.get<any[]>(this.apiUrl + '/ColecaoPublica/Publicas?idUsuario=' + idUsuario);
  }

  listarColecoesCurtidas(idUsuario: number) {
    return this.http.get<any[]>(this.apiUrl + '/ColecaoPublica/Curtidas?idUsuario=' + idUsuario);
  }

  listarMinhasColecoes(idUsuario: number) {
    return this.http.get<any[]>(this.apiUrl + '/ColecaoPublica/Minhas?idUsuario=' + idUsuario);
  }

  obterColecaoPublica(id: number, idUsuario: number) {
    return this.http.get<any>(this.apiUrl + '/ColecaoPublica/' + id + '?idUsuario=' + idUsuario);
  }

  criarColecaoPublica(dados: any) {
    return this.http.post<any>(this.apiUrl + '/ColecaoPublica/Criar', dados);
  }

  atualizarColecaoPublica(id: number, dados: any) {
    return this.http.put(this.apiUrl + '/ColecaoPublica/' + id, dados);
  }

  salvarItensColecao(id: number, idUsuario: number, ids: number[]) {
    return this.http.put(this.apiUrl + '/ColecaoPublica/' + id + '/Itens', { idUsuario, ids });
  }

  curtirColecao(id: number, idUsuario: number) {
    return this.http.post<any>(this.apiUrl + '/ColecaoPublica/' + id + '/Curtir?idUsuario=' + idUsuario, {});
  }

  excluirColecaoPublica(id: number, idUsuario: number) {
    return this.http.delete(this.apiUrl + '/ColecaoPublica/' + id + '?idUsuario=' + idUsuario);
  }

  listarColecoesComPublicacao(idUsuario: number, idDocumento: number) {
    return this.http.get<any[]>(this.apiUrl + '/ColecaoDocumento/Colecoes?idUsuario=' + idUsuario + '&idDocumento=' + idDocumento);
  }

  adicionarPublicacaoNaColecao(idColecao: number, idDocumento: number) {
    return this.http.post(this.apiUrl + '/ColecaoDocumento/Adicionar?idColecao=' + idColecao + '&idDocumento=' + idDocumento, {});
  }

  removerPublicacaoDaColecao(idColecao: number, idDocumento: number) {
    return this.http.delete(this.apiUrl + '/ColecaoDocumento/Remover?idColecao=' + idColecao + '&idDocumento=' + idDocumento);
  }

  /* =========================================
     MARCADORES DE PUBLICAÇÃO
  ========================================= */

  obterMarcador(idUsuario: number, idDocumento: number) {
    return this.http.get<{ marcador: string }>(this.apiUrl + '/MarcadorPublicacao?idUsuario=' + idUsuario + '&idDocumento=' + idDocumento);
  }

  definirMarcador(idUsuario: number, idDocumento: number, marcador: string) {
    return this.http.put(this.apiUrl + '/MarcadorPublicacao', { idUsuario, idDocumento, marcador });
  }

  /* =========================================
     CALENDÁRIO
  ========================================= */

  listarCalendario(idUsuario: number) {
    return this.http.get<any[]>(this.apiUrl + '/Calendario?idUsuario=' + idUsuario);
  }

  criarCalendario(dados: { idUsuario: number; data: string; descricao: string }) {
    return this.http.post<any>(this.apiUrl + '/Calendario', dados);
  }

  editarCalendario(dados: { id: number; idUsuario: number; data: string; descricao: string }) {
    return this.http.put(this.apiUrl + '/Calendario', dados);
  }

  excluirCalendario(id: number) {
    return this.http.delete(this.apiUrl + '/Calendario/' + id);
  }

  /* =========================================
     HISTÓRICO DE LEITURA
  ========================================= */

  listarHistorico(idUsuario: number) {
    return this.http.get<any[]>(this.apiUrl + '/HistoricoLeitura?idUsuario=' + idUsuario);
  }

  registrarLeitura(idUsuario: number, idDocumento: number) {
    return this.http.post(this.apiUrl + '/HistoricoLeitura/Registrar?idUsuario=' + idUsuario + '&idDocumento=' + idDocumento, {});
  }

  /* =========================================
     GRUPOS SEGUIDOS
  ========================================= */

  listarGruposSeguidos(idUsuario: number) {
    return this.http.get<any[]>(this.apiUrl + '/GrupoUsuario/Seguidos?idUsuario=' + idUsuario);
  }

  deixarDeSeguirGrupo(id: number) {
    return this.http.delete(this.apiUrl + '/GrupoUsuario/' + id);
  }
}
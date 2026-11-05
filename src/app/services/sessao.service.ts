export interface UsuarioSessao {
  id: number;
  nome: string;
  email: string;
}

const CHAVE = 'dream_usuario';

export class SessaoService {

  static usuario(): UsuarioSessao | null {
    try {
      const salvo = localStorage.getItem(CHAVE);
      return salvo ? (JSON.parse(salvo) as UsuarioSessao) : null;
    } catch {
      return null;
    }
  }

  static idUsuario(): number {
    return SessaoService.usuario()?.id ?? 0;
  }

  static estaLogado(): boolean {
    return SessaoService.usuario() !== null;
  }

  static entrar(usuario: UsuarioSessao): void {
    localStorage.setItem(CHAVE, JSON.stringify(usuario));
  }

  static sair(): void {
    localStorage.removeItem(CHAVE);
  }
}
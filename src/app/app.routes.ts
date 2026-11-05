import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { MeuPerfil } from './components/meu-perfil/meu-perfil';
import { MinhasPublicacoes } from './components/minhas-publicacoes/minhas-publicacoes';
import { CriarPublicacao } from './components/criar-publicacao/criar-publicacao';
import { TitulosSeguidos } from './components/titulos-seguidos/titulos-seguidos';
import { PerfilPublico } from './components/perfil-publico/perfil-publico';
import { UsuariosSeguidos } from './components/usuarios-seguidos/usuarios-seguidos';
import { GruposSeguidos } from './components/grupos-seguidos/grupos-seguidos';
import { HistoricoLeitura } from './components/historico-leitura/historico-leitura';
import { Colecoes } from './components/colecoes/colecoes';
import { Notificacoes } from './components/notificacoes/notificacoes';
import { Calendario } from './components/calendario/calendario';
import { Home } from './components/home/home';
import { VisualizarPublicacao } from './components/visualizar-publicacao/visualizar-publicacao';
import { NovaColecao } from './components/nova-colecao/nova-colecao';
import { ColecaoDetalhe } from './components/colecao-detalhe/colecao-detalhe';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  { path: 'login', component: Login },

  {
    path: '',
    canActivate: [authGuard],
    children: [

      { path: '', component: Home, pathMatch: 'full' },

      { path: 'meu-perfil', component: MeuPerfil },

      { path: 'perfil-publico', component: PerfilPublico },

      { path: 'criar-publicacao', component: CriarPublicacao },

      { path: 'editar-publicacao/:id', component: CriarPublicacao },

      { path: 'publicacao/:id', component: VisualizarPublicacao },

      { path: 'titulos-seguidos', component: TitulosSeguidos },

      { path: 'usuarios-seguidos', component: UsuariosSeguidos },

      { path: 'grupos-seguidos', component: GruposSeguidos },

      { path: 'historico-leitura', component: HistoricoLeitura },

      { path: 'colecoes', component: Colecoes },

      { path: 'notificacoes', component: Notificacoes },

      { path: 'minhas-publicacoes', component: MinhasPublicacoes },

      { path: 'nova-colecao', component: NovaColecao },
     
      { path: 'colecao/:id', component: ColecaoDetalhe },
     
      { path: 'colecao/:id/editar', component: NovaColecao },

      {
        path: 'configuracoes',
        loadComponent: () =>
          import('./components/configuracoes/configuracoes')
            .then(m => m.Configuracoes)
      },

      { path: 'calendario', component: Calendario }

    ]
  }

];

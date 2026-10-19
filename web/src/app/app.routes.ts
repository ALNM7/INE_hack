import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'La generación que se apagó',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'ficha/:edo/:mpio',
    title: 'Ficha del municipio | La generación que se apagó',
    loadComponent: () => import('./pages/ficha/ficha').then((m) => m.Ficha),
  },
  {
    path: 'metodologia',
    title: 'Metodología | La generación que se apagó',
    loadComponent: () => import('./pages/metodologia/metodologia').then((m) => m.Metodologia),
  },
  {
    path: 'tokens',
    title: 'Tokens | La generación que se apagó',
    loadComponent: () => import('./pages/tokens/tokens').then((m) => m.Tokens),
  },
  { path: '**', redirectTo: '' },
];

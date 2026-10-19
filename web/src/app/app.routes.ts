import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'La generación que se apagó',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'tokens',
    title: 'Tokens | La generación que se apagó',
    loadComponent: () => import('./pages/tokens/tokens').then((m) => m.Tokens),
  },
  { path: '**', redirectTo: '' },
];

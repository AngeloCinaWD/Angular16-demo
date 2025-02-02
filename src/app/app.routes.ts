import { Routes } from '@angular/router';
import { Demo1Component } from './features/demo1.component';

export const routes: Routes = [
  {
    path: 'demo1',
    loadComponent: () =>
      import('./features/demo1.component').then((c) => c.Demo1Component),
  },
  {
    path: 'demo2',
    loadComponent: () =>
      import('./features/demo2/demo2.component').then((c) => c.Demo2Component),
  },
  {
    path: 'demo3',
    loadComponent: () =>
      import('./features/demo3/demo3.component').then((c) => c.Demo3Component),
  },
  {
    path: '',
    redirectTo: 'demo1',
    pathMatch: 'full',
  },
];

import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/components/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'students', pathMatch: 'full' },
      {
        path: 'students',
        loadChildren: () =>
          import('./features/students/students.routes').then((m) => m.routes),
      },
    ],
  },

  { path: '**', redirectTo: 'students' }
];

import { Routes } from '@angular/router';

// ============================================================
//  ROUTES DU MODULE STUDENTS
//  Chaque composant est chargé en lazy avec loadComponent
//  → bundle séparé par composant = performance optimale
// ============================================================

export const STUDENTS_ROUTES: Routes = [
  {
    path          : '',
    title         : 'Liste des Étudiants',
    loadComponent : () =>
      import('./components/student-list/student-list.component')
        .then(m => m.StudentListComponent),
  },
  {
    path          : 'add',
    title         : 'Ajouter un Étudiant',
    loadComponent : () =>
      import('./components/student-form/student-form.component')
        .then(m => m.StudentFormComponent),
  },
  {
    path          : 'edit/:id',
    title         : 'Modifier un Étudiant',
    loadComponent : () =>
      import('./components/student-form/student-form.component')
        .then(m => m.StudentFormComponent),
  },
  // Fallback interne : redirection vers la liste
  { path: '**', redirectTo: '' },
];
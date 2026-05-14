import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule }                  from '@angular/common';
import { Router, RouterModule }          from '@angular/router';
 
// Angular Material
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule }             from '@angular/material/toolbar';
import { MatListModule }                from '@angular/material/list';
import { MatIconModule }                from '@angular/material/icon';
import { MatButtonModule }              from '@angular/material/button';
import { MatDividerModule }             from '@angular/material/divider';
import { MatTooltipModule }             from '@angular/material/tooltip';
 
// ============================================================
//  INTERFACE — item de navigation
// ============================================================
 
interface NavItem {
  label : string;
  icon  : string;
  route : string;
}
 
// ============================================================
//  COMPOSANT
// ============================================================
 
@Component({
  selector   : 'app-main-layout',
  standalone : true,
  imports    : [
    CommonModule,
    RouterModule,
    // Material — uniquement ce qui est utilisé dans ce layout
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl : './main-layout.component.html',
  styleUrl    : './main-layout.component.css',
})
export class MainLayoutComponent {
 
  @ViewChild('sidenav') sidenav!: MatSidenav;
 
  /** Signal Angular 17 → détermine si le texte des items est visible */
  isExpanded = signal(true);
 
  readonly navItems: NavItem[] = [
    {
      label : 'Liste des Étudiants',
      icon  : 'people',
      route : '/students',
    },
    {
      label : 'Ajouter un Étudiant',
      icon  : 'person_add',
      route : '/students/add',
    },
  ];
 
  constructor(private router: Router) {}
 
  // -----------------------------------------------------------
  // Actions
  // -----------------------------------------------------------
 
  toggleSidenav(): void {
    this.sidenav.toggle();
    this.isExpanded.set(!this.isExpanded());
  }
 
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
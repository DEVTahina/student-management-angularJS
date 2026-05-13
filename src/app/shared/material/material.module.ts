import { NgModule } from '@angular/core';
// Layout
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
// Navigation
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
// Boutons & Icônes
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
// Formulaires
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
// Table & Données
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
// Feedback
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// ============================================================
//  Tableau unique → facile à maintenir
// ============================================================
const MATERIAL_MODULES = [
  // Layout
  MatSidenavModule,
  MatToolbarModule,
  MatCardModule,
  MatDividerModule,
  MatListModule,
  // Navigation
  MatMenuModule,
  MatTabsModule,
  // Boutons & Icônes
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatBadgeModule,
  // Formulaires
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  // Table & Données
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatChipsModule,
  // Feedback
  MatDialogModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
];
@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES, // ← Re-exporté → tout module qui importe MaterialModule
}) //   a accès à tous les composants Material
export class MaterialModule {}

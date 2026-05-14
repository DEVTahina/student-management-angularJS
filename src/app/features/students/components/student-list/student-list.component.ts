import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule }         from '@angular/common';
import { Router }               from '@angular/router';
import { Subject }              from 'rxjs';
import { takeUntil }            from 'rxjs/operators';

// Angular Material
import { MatTableDataSource, MatTableModule }    from '@angular/material/table';
import { MatPaginator, MatPaginatorModule }      from '@angular/material/paginator';
import { MatSort, MatSortModule }                from '@angular/material/sort';
import { MatDialog }                             from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule }        from '@angular/material/snack-bar';
import { MatFormFieldModule }                    from '@angular/material/form-field';
import { MatInputModule }                        from '@angular/material/input';
import { MatButtonModule }                       from '@angular/material/button';
import { MatIconModule }                         from '@angular/material/icon';
import { MatTooltipModule }                      from '@angular/material/tooltip';
import { MatCardModule }                         from '@angular/material/card';
import { MatChipsModule }                        from '@angular/material/chips';
import { MatDividerModule }                      from '@angular/material/divider';
import { MatBadgeModule }                        from '@angular/material/badge';

// App
import { Student }                from '../../../../core/models/student.model';
import { StudentService }         from '../../../../core/services/student.service';
import { ConfirmDialogComponent, openConfirmDialog }
  from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

// ============================================================
//  CONSTANTES
// ============================================================

const DISPLAYED_COLUMNS: string[] = [
  'matricule',
  'nom',
  'prenoms',
  'dateNaissance',
  'sexe',
  'niveau',
  'telephone',
  'email',
  'actions',
];

// ============================================================
//  COMPOSANT
// ============================================================

@Component({
  selector   : 'app-student-list',
  standalone : true,
  imports    : [
    CommonModule,
    // Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatBadgeModule,
    MatSnackBarModule,
  ],
  templateUrl : './student-list.component.html',
  styleUrl    : './student-list.component.css',
})
export class StudentListComponent implements OnInit, AfterViewInit, OnDestroy {

  // -----------------------------------------------------------
  // Table
  // -----------------------------------------------------------
  readonly displayedColumns = DISPLAYED_COLUMNS;
  dataSource = new MatTableDataSource<Student>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)      sort!     : MatSort;

  // -----------------------------------------------------------
  // État
  // -----------------------------------------------------------
  totalCount = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly studentService : StudentService,
    private readonly dialog         : MatDialog,
    private readonly snackBar       : MatSnackBar,
    private readonly router         : Router,
  ) {}

  // -----------------------------------------------------------
  // Lifecycle
  // -----------------------------------------------------------

  ngOnInit(): void {
    this.studentService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(students => {
        this.dataSource.data = students;
        this.totalCount      = students.length;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort      = this.sort;

    // Filtre personnalisé : recherche sur plusieurs colonnes
    this.dataSource.filterPredicate = this.buildFilterPredicate();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // -----------------------------------------------------------
  // Filtre
  // -----------------------------------------------------------

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();

    // Retour à la première page après filtrage
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Recherche sur : matricule, nom, prénoms, email, niveau */
  private buildFilterPredicate() {
    return (student: Student, filter: string): boolean => {
      const searchStr = [
        student.matricule,
        student.nom,
        student.prenoms,
        student.email,
        student.niveau,
        student.telephone,
      ].join(' ').toLowerCase();
      return searchStr.includes(filter);
    };
  }

  // -----------------------------------------------------------
  // Actions CRUD
  // -----------------------------------------------------------

  onAdd(): void {
    this.router.navigate(['/students/add']);
  }

  onEdit(student: Student): void {
    this.router.navigate(['/students/edit', student.id]);
  }

  onDelete(student: Student): void {
    openConfirmDialog(this.dialog, {
      title       : 'Supprimer l\'étudiant',
      message     : `Voulez-vous vraiment supprimer ${student.nom} ${student.prenoms} (${student.matricule}) ?
                     Cette action est irréversible.`,
      icon        : 'delete_forever',
      confirmText : 'Supprimer',
      cancelText  : 'Annuler',
      color       : 'warn',
    }).subscribe(confirmed => {
      if (!confirmed) { return; }
      const success = this.studentService.delete(student.id);
      this.snackBar.open(
        success
          ? `✓ ${student.nom} ${student.prenoms} supprimé(e) avec succès`
          : '✗ Erreur lors de la suppression',
        'Fermer',
        { duration: 3500, panelClass: success ? 'snack-success' : 'snack-error' },
      );
    });
  }

  // -----------------------------------------------------------
  // Utilitaires template
  // -----------------------------------------------------------

  /** Retourne la couleur du chip Niveau */
  getNiveauColor(niveau: string): string {
    const colors: Record<string, string> = {
      'Licence 1' : '#e3f2fd',
      'Licence 2' : '#bbdefb',
      'Licence 3' : '#90caf9',
      'Master 1'  : '#ce93d8',
      'Master 2'  : '#ba68c8',
      'Doctorat'  : '#ff8a65',
    };
    return colors[niveau] ?? '#e0e0e0';
  }

  /** Retourne l'icône selon le sexe */
  getSexeIcon(sexe: string): string {
    return sexe === 'Masculin' ? 'male' : 'female';
  }

  getSexeColor(sexe: string): string {
    return sexe === 'Masculin' ? '#1565C0' : '#AD1457';
  }
}
import { Component, OnInit }    from '@angular/core';
import { CommonModule }          from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

// Angular Material
import { MatFormFieldModule }         from '@angular/material/form-field';
import { MatInputModule }             from '@angular/material/input';
import { MatSelectModule }            from '@angular/material/select';
import { MatDatepickerModule }        from '@angular/material/datepicker';
import { MatNativeDateModule }        from '@angular/material/core';
import { MatButtonModule }            from '@angular/material/button';
import { MatIconModule }              from '@angular/material/icon';
import { MatCardModule }              from '@angular/material/card';
import { MatDividerModule }           from '@angular/material/divider';
import { MatProgressSpinnerModule }   from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// App
import { Sexe, Niveau }       from '../../../../core/models/student.model';
import { StudentService }      from '../../../../core/services/student.service';

// ============================================================
//  VALIDATEUR PERSONNALISÉ — téléphone Madagascar / international
// ============================================================

function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value ?? '').replace(/\s/g, '');
  // Accepte : +261XXXXXXXXX | 034XXXXXXX | 032XXXXXXX | 033XXXXXXX
  const valid = /^(\+?\d{8,15})$/.test(value);
  return valid ? null : { invalidPhone: true };
}

// ============================================================
//  COMPOSANT
// ============================================================

@Component({
  selector   : 'app-student-form',
  standalone : true,
  imports    : [
    CommonModule,
    ReactiveFormsModule,
    // Material
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl : './student-form.component.html',
  styleUrl    : './student-form.component.css',
})
export class StudentFormComponent implements OnInit {

  // -----------------------------------------------------------
  // État
  // -----------------------------------------------------------
  studentForm!: FormGroup;
  isEditMode   = false;
  studentId    : string | null = null;
  isSubmitting = false;

  // -----------------------------------------------------------
  // Options des selects  (tirées des enums)
  // -----------------------------------------------------------
  readonly sexeOptions   = Object.values(Sexe);
  readonly niveauOptions = Object.values(Niveau);

  // Date max pour le datepicker (aujourd'hui)
  readonly maxDate = new Date();
  // Date min (100 ans en arrière)
  readonly minDate = new Date(
    new Date().getFullYear() - 100,
    new Date().getMonth(),
    new Date().getDate(),
  );

  constructor(
    private readonly fb            : FormBuilder,
    private readonly studentService: StudentService,
    private readonly router        : Router,
    private readonly route         : ActivatedRoute,
    private readonly snackBar      : MatSnackBar,
  ) {}

  // -----------------------------------------------------------
  // Lifecycle
  // -----------------------------------------------------------

  ngOnInit(): void {
    this.buildForm();

    this.studentId = this.route.snapshot.paramMap.get('id');

    if (this.studentId) {
      this.isEditMode = true;
      this.prefillForm(this.studentId);
    }
  }

  // -----------------------------------------------------------
  // Construction du formulaire
  // -----------------------------------------------------------

  private buildForm(): void {
    this.studentForm = this.fb.group({
      matricule    : [
        '',
        [Validators.required, Validators.pattern(/^[A-Z0-9\-]+$/)],
      ],
      nom          : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenoms      : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      dateNaissance: ['', Validators.required],
      sexe         : ['', Validators.required],
      adresse      : ['', [Validators.required, Validators.minLength(5)]],
      telephone    : ['', [Validators.required, phoneValidator]],
      email        : ['', [Validators.required, Validators.email]],
      niveau       : ['', Validators.required],
    });
  }

  // -----------------------------------------------------------
  // Pré-remplissage (mode édition)
  // -----------------------------------------------------------

  private prefillForm(id: string): void {
    const student = this.studentService.getById(id);

    if (!student) {
      this.snackBar.open('Étudiant introuvable.', 'Fermer', { duration: 3000 });
      this.router.navigate(['/students']);
      return;
    }

    this.studentForm.patchValue({
      ...student,
      // Le datepicker attend un objet Date, pas une chaîne ISO
      dateNaissance: new Date(student.dateNaissance),
    });

    // Matricule non modifiable en mode édition
    this.studentForm.get('matricule')?.disable();
  }

  // -----------------------------------------------------------
  // Getters de confort pour le template
  // -----------------------------------------------------------

  get f() { return this.studentForm.controls; }

  getError(field: string): string {
    const ctrl = this.studentForm.get(field);
    if (!ctrl?.touched || !ctrl.errors) { return ''; }

    if (ctrl.errors['required'])     { return 'Ce champ est obligatoire.'; }
    if (ctrl.errors['email'])        { return 'Adresse email invalide.'; }
    if (ctrl.errors['invalidPhone']) { return 'Numéro de téléphone invalide (8 à 15 chiffres).'; }
    if (ctrl.errors['minlength']) {
      return `Minimum ${ctrl.errors['minlength'].requiredLength} caractères.`;
    }
    if (ctrl.errors['maxlength']) {
      return `Maximum ${ctrl.errors['maxlength'].requiredLength} caractères.`;
    }
    if (ctrl.errors['pattern']) {
      if (field === 'matricule') { return 'Lettres majuscules, chiffres et tirets uniquement.'; }
    }
    return 'Valeur invalide.';
  }

  // -----------------------------------------------------------
  // Soumission
  // -----------------------------------------------------------

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // getRawValue() récupère aussi les champs disabled (matricule en edit)
    const raw = this.studentForm.getRawValue();

    const studentData = {
      ...raw,
      // Convertir la Date du datepicker en chaîne ISO YYYY-MM-DD
      dateNaissance : (raw.dateNaissance as Date)
        .toISOString()
        .split('T')[0],
      // Forcer la casse du matricule
      matricule: (raw.matricule as string).toUpperCase(),
    };

    // --- Vérification unicité matricule ---
    if (!this.studentService.isMatriculeUnique(studentData.matricule, this.studentId ?? undefined)) {
      this.snackBar.open(
        `Le matricule "${studentData.matricule}" est déjà utilisé.`,
        'Fermer',
        { duration: 4000, panelClass: 'snack-error' },
      );
      this.isSubmitting = false;
      return;
    }

    // --- Vérification unicité email ---
    if (!this.studentService.isEmailUnique(studentData.email, this.studentId ?? undefined)) {
      this.snackBar.open(
        `L'email "${studentData.email}" est déjà utilisé.`,
        'Fermer',
        { duration: 4000, panelClass: 'snack-error' },
      );
      this.isSubmitting = false;
      return;
    }

    try {
      if (this.isEditMode && this.studentId) {
        this.studentService.update(this.studentId, studentData);
        this.notify('✓ Étudiant modifié avec succès !', 'snack-success');
      } else {
        this.studentService.create(studentData);
        this.notify('✓ Étudiant ajouté avec succès !', 'snack-success');
      }
      this.router.navigate(['/students']);
    } catch {
      this.notify('✗ Une erreur est survenue. Veuillez réessayer.', 'snack-error');
    } finally {
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/students']);
  }

  // -----------------------------------------------------------
  // Utilitaire
  // -----------------------------------------------------------

  private notify(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Fermer', { duration: 3500, panelClass });
  }
}
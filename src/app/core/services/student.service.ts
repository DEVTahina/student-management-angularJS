import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  Student,
  StudentFormData,
  StudentSummary,
} from '../models/student.model';

//  CONSTANTES
const STORAGE_KEY = 'manage-student-v1';

//  SERVICE
@Injectable({ providedIn: 'root' })
export class StudentService {
  // Etat réactif central
  private readonly _students$ = new BehaviorSubject<Student[]>(
    this.loadFromStorage(),
  );

  // Flux pubic pour en lecture seule
  readonly students$: Observable<Student[]> = this._students$.asObservable();


    /** Flux des résumés (moins de données transmises aux listes légères) */
  readonly summaries$: Observable<StudentSummary[]> = this._students$.pipe(
    map(list =>
      list.map(({ id, matricule, nom, prenoms, niveau, sexe }) => ({
        id, matricule, nom, prenoms, niveau, sexe,
      }))
    )
  );

  // Lecture

  getAll(): Observable<Student[]> {
    return this.students$;
  }

  getById(id: string): Student | undefined {
    return this._students$.getValue().find((s) => s.id === id);
  }

  count(): number {
    return this._students$.getValue().length;
  }

  // -----------------------------------------------------------
  // Écriture
  // -----------------------------------------------------------
  create(formData: StudentFormData): Student {
    const newStudent: Student = {
      id: this.generateId(),
      ...formData,
    };
    const updated = [...this._students$.getValue(), newStudent];
    this.persist(updated);
    return newStudent;
  }
  update(id: string, formData: StudentFormData): boolean {
    const list = [...this._students$.getValue()];
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) {
      return false;
    }
    list[index] = { id, ...formData };
    this.persist(list);
    return true;
  }
  delete(id: string): boolean {
    const filtered = this._students$.getValue().filter((s) => s.id !== id);
    if (filtered.length === this._students$.getValue().length) {
      return false;
    }
    this.persist(filtered);
    return true;
  }

  // -----------------------------------------------------------
  // Validation métier

  /**
   * Vérifie que le matricule n'est pas déjà pris.
   * @param excludeId  Passer l'id lors d'une modification pour ne pas
   *                   comparer l'étudiant avec lui-même.
   */
  isMatriculeUnique(matricule: string, excludeId?: string): boolean {
    return !this._students$
      .getValue()
      .some(
        (s) =>
          s.matricule.toLowerCase() === matricule.toLowerCase() &&
          s.id !== excludeId,
      );
  }

  isEmailUnique(email: string, excludeId?: string): boolean {
    return !this._students$
      .getValue()
      .some(
        (s) =>
          s.email.toLowerCase() === email.toLowerCase() && s.id !== excludeId,
      );
  }

  // Méthodes privées

  private loadFromStorage(): Student[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Student[]) : [];
    } catch {
      console.error('[StudentService] Erreur lecture LocalStorage');
      return [];
    }
  }

  private persist(students: Student[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
      this._students$.next(students);
    } catch {
      console.error('[StudentService] Erreur écriture LocalStorage');
    }
  }

  /** Génère un identifiant unique court (base-36 + aléatoire) */
  private generateId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }
}

import { Component, Inject }        from '@angular/core';
import { CommonModule }              from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef }
                                     from '@angular/material/dialog';
import { MatButtonModule }           from '@angular/material/button';
import { MatIconModule }             from '@angular/material/icon';
import { MatDialog }                 from '@angular/material/dialog';
import { Observable }                from 'rxjs';

// ============================================================
//  INTERFACE
// ============================================================

export interface ConfirmDialogData {
  title       : string;
  message     : string;
  icon?       : string;
  confirmText?: string;
  cancelText? : string;
  color?      : 'primary' | 'accent' | 'warn';
}

// ============================================================
//  COMPOSANT — STANDALONE (Angular 17)
// ============================================================

@Component({
  selector   : 'app-confirm-dialog',
  standalone : true,                  // ← STANDALONE obligatoire en Angular 17
  imports    : [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './confirm-dialog.component.html',
  styles: [`
    .dialog-title-row {
      display    : flex;
      align-items: center;
      gap        : 10px;
    }
    mat-dialog-content p {
      font-size  : 15px;
      color      : #555;
      margin     : 0;
      line-height: 1.6;
      white-space: pre-line;   /* respecte les sauts de ligne dans le message */
    }
    mat-dialog-actions {
      padding: 12px 24px 20px;
      gap    : 10px;
    }
  `],
})
export class ConfirmDialogComponent {

  constructor(
    public  dialogRef : MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {
    // Valeurs par défaut
    this.data.icon        = data.icon        ?? 'warning';
    this.data.confirmText = data.confirmText ?? 'Confirmer';
    this.data.cancelText  = data.cancelText  ?? 'Annuler';
    this.data.color       = data.color       ?? 'warn';
  }

  onConfirm(): void { this.dialogRef.close(true);  }
  onCancel() : void { this.dialogRef.close(false); }
}

// ============================================================
//  HELPER — usage dans n'importe quel composant :
//
//  openConfirmDialog(this.dialog, {
//    title   : 'Supprimer',
//    message : 'Confirmer la suppression ?',
//    color   : 'warn',
//  }).subscribe(confirmed => { if (confirmed) { ... } });
// ============================================================

export function openConfirmDialog(
  dialog : MatDialog,
  data   : ConfirmDialogData,
  width  : string = '440px',
): Observable<boolean> {
  return dialog
    .open(ConfirmDialogComponent, { width, data, disableClose: true })
    .afterClosed() as Observable<boolean>;
}
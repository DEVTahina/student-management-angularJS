import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

// ============================================================
//  INTERFACE — données injectées dans le dialog
// ============================================================
 
export interface ConfirmDialogData {
  /** Titre affiché en haut du dialog */
  title       : string;
  /** Message principal (question de confirmation) */
  message     : string;
  /** Icône Material affichée à côté du titre  (défaut: "warning") */
  icon?       : string;
  /** Texte du bouton de confirmation           (défaut: "Confirmer") */
  confirmText?: string;
  /** Texte du bouton d'annulation              (défaut: "Annuler") */
  cancelText? : string;
  /** Couleur Material du bouton confirm        (défaut: "warn") */
  color?      : 'primary' | 'accent' | 'warn';
}

// ============================================================
//  COMPOSANT
// ============================================================
 
@Component({
  selector    : 'app-confirm-dialog',
   standalone  : true,                         
  imports     : [CommonModule, MatDialogModule, 
                 MatButtonModule, MatIconModule],
  templateUrl : './confirm-dialog.component.html',
  styles: [`
    .dialog-title-row {
      display     : flex;
      align-items : center;
      gap         : 10px;
    }
    mat-dialog-content p {
      font-size   : 15px;
      color       : #555;
      margin      : 0;
      line-height : 1.6;
    }
    mat-dialog-actions {
      padding    : 16px 24px;
      gap        : 10px;
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
 
  // -----------------------------------------------------------
  // Actions
  // -----------------------------------------------------------
 
  onConfirm(): void {
    this.dialogRef.close(true);
  }
 
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
 
// ============================================================
//  HELPER — ouvre le dialog depuis n'importe quel composant
//  Usage :
//    import { openConfirmDialog } from '...confirm-dialog.component';
//    openConfirmDialog(this.dialog, { title:'...', message:'...' })
//      .subscribe(confirmed => { if (confirmed) { ... } });
// ============================================================
 
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
 
export function openConfirmDialog(
  dialog  : MatDialog,
  data    : ConfirmDialogData,
  width   : string = '420px',
): Observable<boolean> {
  return dialog.open(ConfirmDialogComponent, { width, data, disableClose: true })
               .afterClosed() as Observable<boolean>;
}
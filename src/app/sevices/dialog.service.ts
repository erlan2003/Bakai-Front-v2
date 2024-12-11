import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  dialogRef: MatDialogRef<any> | undefined;
  constructor(private dialog: MatDialog) {}

  openDialog(component: any, data?: any, width?: string, height?: string) {
    const config: MatDialogConfig = {
      width: width || 'auto',
      height: height || 'auto',
      maxWidth: '100%',
      data,
      autoFocus: false,
      closeOnNavigation: true,
      hasBackdrop: true,
    };
    const closeOnEnterOrEsc = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    this.dialogRef = this.dialog.open(component, config);

    if (this.dialogRef) {
      this.dialogRef.afterOpened().subscribe(() => {
        document.addEventListener('keydown', closeOnEnterOrEsc);
      });
      this.dialogRef.afterClosed().subscribe(() => {
        document.removeEventListener('keydown', closeOnEnterOrEsc);
      });
    }

    return this.dialogRef;
  }
  closeAll() {
    this.dialog.closeAll();
  }
}

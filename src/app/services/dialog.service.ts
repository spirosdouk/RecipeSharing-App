import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from '../components/filter-dialog/filter-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openFilterDialog(data: { cuisine: string, selectedIntolerances: string[] }): Promise<any> {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '300px',
      data: data
    });

    return dialogRef.afterClosed().toPromise();
  }
}

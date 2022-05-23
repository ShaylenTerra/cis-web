import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class SnackbarService {
    constructor(private snackBar: MatSnackBar) {
    }

    openSnackBar(message: string, action: string) {
        if (action === 'Success') {
            this.snackBar.open(message, action, {
                duration: 8000,
                panelClass: 'success-snack-bar',
                verticalPosition: 'bottom',
                horizontalPosition: 'left'
            });
        }

        if (action === 'Error') {
            this.snackBar.open(message, action, {
                duration: 8000,
                panelClass: 'error-snack-bar',
                verticalPosition: 'bottom',
                horizontalPosition: 'left'
            });
        }

        if (action === 'Warning') {
            this.snackBar.open(message, action, {
                duration: 8000,
                panelClass: 'warning-snack-bar',
                verticalPosition: 'bottom',
                horizontalPosition: 'left'
            });
        }
    }
}

import {RequestDialogComponent} from './../request-dialog/request-dialog.component';
import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})
export class RequestDetailComponent {


  constructor(public dialog: MatDialog, private snackbar: SnackbarService) {
  }
  openCarousel() {
    const dialogRef = this.dialog.open(RequestDialogComponent, {
      width: '1500px'
    });
    dialogRef.afterClosed().subscribe(async (resultCode) => {
    });
  }

  onWishlist() {
    setTimeout(() => {
      this.snackbar.openSnackBar('Added to Wishlist', 'Success');
    }, 1000);
  }
}

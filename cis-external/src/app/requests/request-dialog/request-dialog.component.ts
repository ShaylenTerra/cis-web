import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ThemePalette} from '@angular/material/core';
import {MatCarouselSlideComponent, Orientation} from '@ngmodule/material-carousel';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
  selector: 'app-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.css']
})
export class RequestDialogComponent implements OnInit {
  public slidesList = new Array<never>(5);
  public showContent = false;
  public parentHeight = 'auto';
  public timings = '250ms ease-in';
  public interval = 5000;
  public color: ThemePalette = 'accent';
  public maxWidth = 'auto';
  public maintainAspectRatio = true;
  public proportion = 25;
  public slideHeight = '200px';
  public slides = this.slidesList.length;
  public overlayColor = '#00000040';
  public hideOverlay = false;
  public useKeyboard = true;
  public useMouseWheel = false;
  public orientation: Orientation = 'ltr';
  public log: string[] = [];
  @ViewChildren(MatCarouselSlideComponent) public carouselSlides: QueryList<MatCarouselSlideComponent>;

  constructor(public dialogRef: MatDialogRef<RequestDialogComponent>, private snackbar: SnackbarService) { }

  ngOnInit() {
  }
  public resetSlides(): void {
    this.carouselSlides.forEach(item => (item.disabled = false));
  }
  onClose(): void {
    this.dialogRef.close();
  }

  onDownload() {
    setTimeout(() => {
      this.snackbar.openSnackBar('Download started', 'Success');
    }, 3000);
  }
}

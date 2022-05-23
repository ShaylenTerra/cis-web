import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {LoaderService} from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
    selector: 'app-search-details-dialog',
    templateUrl: 'search-details.dialog.html',
    styleUrls: ['./search-details.dialog.css']
})
export class SearchDetailsDialogComponent {
    images = [];
    downloadStat = true;
    constructor(public dialogRef: MatDialogRef<SearchDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private snackbar: SnackbarService,
        public restService: RestcallService, private loaderService: LoaderService) {
        if (data.filesize.includes('MB')) {
            if (data.filesize.split(' ')[0] < 10) {
                this.downloadStat = true;
            } else {
                this.downloadStat = false;
                this.snackbar.openSnackBar('Download not possible as image size is greater than 10MB', 'Warning');
            }
        }
        this.images = [];
        data.images.forEach(img => {
            this.images.push({
                src: img.preview
            });
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    downloadImage(imageUrl) {
        this.loaderService.display(true);
        const image: any[] = [];
        image.push(imageUrl);
        const fileName = imageUrl.split('/').pop();
        const obj = {
            'dataKeyName': 'sgdata',
            'documentName': fileName,
            'documentUrl': image,
            'provinceId': 1,
            'userId': JSON.parse(sessionStorage.getItem('userInfo')).userId
        };
        this.restService.downloadSgDataImage(obj).subscribe(payload => {
            this.downloadBlob(payload, fileName);
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    downloadBlob(blob, name) {
        this.loaderService.display(true);
        // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
        const blobUrl = URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');

        // Set link's href to point to the Blob URL
        link.href = blobUrl;
        link.download = name;

        // Append link to the body
        document.body.appendChild(link);

        // Dispatch click event on the link
        // This is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );

        // Remove link from body
        document.body.removeChild(link);
        this.loaderService.display(false);
    }
}

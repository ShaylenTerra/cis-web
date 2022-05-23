import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../services/restcall.service';

@Component({
    selector: 'app-search-details-dialog',
    templateUrl: 'search-details.dialog.html',
    styleUrls: ['./search-details.dialog.css']
})
export class SearchDetailsDialogComponent {
    images = [];

    constructor(public dialogRef: MatDialogRef<SearchDetailsDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public restService: RestcallService) {
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
        }, error => {
        });
    }

    downloadBlob(blob, name) {
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
    }
}

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { SearchService } from '../../search/search-page/search.service';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
    selector: 'app-profile-image',
    templateUrl: 'profile-image.modal.html',
    styleUrls: ['profile-image.modal.css']
})

export class ProfileImageDialogComponent {
  crop: Boolean = false;
  imageChangedEvent: any;
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  url: any = '';
  uploadedFileName = 'Upload document';
  fileToUpload: File = null;
    constructor(public dialogRef: MatDialogRef<ProfileImageDialogComponent>,
                private dom: DomSanitizer, private restCallService: RestcallService,
                private loaderService: LoaderService, public searchService: SearchService,
                private snackbar: SnackbarService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
                  this.getProfileImage();
    }

  getProfileImage() {
    this.loaderService.display(true);
      this.restCallService.getProfileImage().subscribe(response => {
          const reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onload = (_event) => {
              this.url = reader.result;
          };
          this.loaderService.display(false);
        }, error => {
          this.loaderService.display(false);
      });
  }

  updateProfileImge() {
      this.loaderService.display(true);
      const imageName = this.uploadedFileName;
      const imageBlob = this.dataURItoBlob(this.url);
      const imageFile = new File([imageBlob], imageName, { type: this.fileToUpload[0]['type'] });
      const formData: FormData = new FormData();
      formData.append('image', imageFile);
      this.restCallService.updateProfileImage(formData).subscribe(response => {
         this.searchService.getProfileImage();
         this.crop = false;
         this.loaderService.display(false);
         this.snackbar.openSnackBar('Profile picture updated', 'Success');
         this.dialogRef.close();
      });
  }

  fileChangeEvent(event: any) {
      this.imageChangedEvent = event;
      if (event.target.files && event.target.files[0]) {
          const reader = new FileReader();
          this.fileToUpload = event.target.files;
          this.uploadedFileName = event.target.files[0]['name'];

          reader.readAsDataURL(event.target.files[0]); // read file as data url
      }
      this.crop = true;
    }

    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      const byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      const ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      const ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      const blob = new Blob([ab], {type: mimeString});
      return blob;

    }
    imageCropped(event: ImageCroppedEvent) {
      this.url = '';
      this.croppedImage = event.base64;
      this.url = event.base64;
      event = null;
    }

    imageLoaded() {
      this.showCropper = true;
    }

    cropperReady(sourceImageDimensions: Dimensions) {
      console.log('Cropper ready', sourceImageDimensions);
    }

    loadImageFailed() {
      console.log('Load failed');
    }

    cancel() {
      this.getProfileImage();
      this.crop = false;
      this.url = '';
      this.dialogRef.close();
    }

    save() {
        this.updateProfileImge();
    }
}

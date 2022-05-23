import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LoaderService} from './services/loader.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {
    showLoader = false;

    constructor(private loaderService: LoaderService, private cdRef: ChangeDetectorRef) {

    }

    ngOnInit() {
        // this.loaderService.status.subscribe((val: boolean) => {
        //     this.showLoader = val;
        // });
    }


    ngAfterViewChecked() {
        this.loaderService.status.subscribe((val: boolean) => {
            this.showLoader = val;
            this.cdRef.detectChanges();
        });
    }

}

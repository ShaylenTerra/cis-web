import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
    selector: 'app-track-order',
    templateUrl: './track-order.component.html',
    styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit {
    isSpinnerVisible = false;
    form: FormGroup;
    referenceNo = '';
    result;
    errmsg: any;

    constructor(private fb: FormBuilder, private restService: RestcallService,
        private snackbar: SnackbarService) {
        this.form = this.fb.group({
            referenceNo: ['', Validators.required]
        });
    }

    ngOnInit() {
    }

    submit() {
        this.restService.searchByRefNo(this.referenceNo).subscribe(response => {
            if (response.data === null) {
                this.errmsg = 'The number entered for tracking was not found';
                this.result = '';
            } else {
                this.result = response.data;
                this.errmsg = '';
            }
        });
    }
}

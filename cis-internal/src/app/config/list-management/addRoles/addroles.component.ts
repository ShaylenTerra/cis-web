import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {EventInput} from '@fullcalendar/core';
import {LoaderService} from '../../../services/loader.service';

@Component({
    selector: 'app-addroles',
    templateUrl: './addroles.component.html',
    styleUrls: ['./addroles.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddrolesComponent implements OnInit {

    isSpinnerVisible = false;
    form: FormGroup;
    calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
    calendarWeekends = true;
    calendarEvents: EventInput[] = [];
    nationalHoliday: any[] = [];
    userLeave: any[] = [];
    officeHoliday: any[] = [];
    sections: any[] = [];
    // userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

    constructor(public dialogRef: MatDialogRef<AddrolesComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService, private loaderService: LoaderService,
                private cdRef: ChangeDetectorRef) {
        this.form = this.fb.group({
            description: '',
            isActive: false,
            parentRoleId: '',
            roleCode: '',
            roleName: '',
            userTypeItemId: '',
            approvalRequired: '',
            sectionItemId: '',
            roleId: 0
        });
    }

    ngOnInit() {
      this.loaderService.display(true);
      this.restService.getListItems(19).subscribe((section: any) => {
        this.sections = section.data;

        if (this.data.value == null) {
          this.form.patchValue({
              userTypeItemId: this.data.role,
              parentRoleId: 0
          });
        } else if (this.data.value !== null) {
          this.form.patchValue({
            description: this.data.value.description,
            isActive: this.data.value.isActive === 1 ? true : false,
            parentRoleId: this.data.value.parentRoleId,
            roleCode: this.data.value.roleCode,
            roleName: this.data.value.roleName,
            userTypeItemId: this.data.value.userTypeItemId,
            approvalRequired: this.data.value.approvalRequired === 1 ? true : false,
            sectionItemId: this.data.value.sectionItemId,
            roleId: this.data.value.roleId
          });
        }

        this.loaderService.display(false);
      });
    }

    submit() {
        this.loaderService.display(true);
        if (this.form.invalid) {
          this.form.get('description').markAsTouched();
          this.form.get('roleCode').markAsTouched();
          this.form.get('roleName').markAsTouched();
          this.loaderService.display(false);
        } else {
          const obj = this.form.value;
          obj.isActive = this.form.value.isActive === true ? 1 : 0;
          obj.approvalRequired = this.form.value.approvalRequired === true ? 1 : 0;
          this.restService.addRole(obj)
            .subscribe((res) => {
              this.form.patchValue({
                description: '',
                isActive: false,
                parentRoleId: '',
                roleCode: '',
                roleName: '',
                userTypeItemId: '',
                approvalRequired: '',
                sectionItemId: '',
                roleId: 0
              });
              this.loaderService.display(false);
              this.dialogRef.close();
            }, error => {
              this.loaderService.display(false);
            });
        }
      }
}

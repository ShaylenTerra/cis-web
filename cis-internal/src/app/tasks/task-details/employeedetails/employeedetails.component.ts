import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {EventInput} from '@fullcalendar/core';
import {LoaderService} from '../../../services/loader.service';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-employeedetails',
    templateUrl: './employeedetails.component.html',
    styleUrls: ['./employeedetails.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeedetailsComponent implements OnInit, AfterViewInit {

    isSpinnerVisible = false;
    form: FormGroup;
    calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
    calendarWeekends = true;
    calendarEvents: EventInput[] = [];
    nationalHoliday: any[] = [];
    userLeave: any[] = [];
    officeHoliday: any[] = [];
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    userData: any;
    url: any;

    constructor(public dialogRef: MatDialogRef<EmployeedetailsComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService, private loaderService: LoaderService,
                private cdRef: ChangeDetectorRef) {
        this.form = this.fb.group({
            firstName: '',
            lastName: '',
            email: '',
            mobileNo: ''
        });
    }

    ngOnInit() {
        if (this.data !== '') {
            // this.form.patchValue({
            //    firstName: this.data.firstName,
            //    lastName: this.data.surname,
            //    email: this.data.email,
            //    mobileNo: this.data.mobileNo
            // });

            this.userId = this.data;
        }
        this.initialise();
        this.setProfileImages();
    }

    initialise() {
        this.loaderService.display(true);
        forkJoin([
            this.restService.getHolidays(new Date().getFullYear()),
            this.restService.getUserHolidays(this.userId),
            this.restService.getOfficeTimingForUserId(this.userId),
            this.restService.getUserByUserID(this.userId)
        ]).subscribe(([natHolidays, userHolidays, officeHolidays, user]) => {
            this.userData = user.data || [];
            if (this.userData != null) {
                this.form.patchValue({
                    firstName: user.data.firstName,
                    lastName: user.data.surname,
                    email: user.data.email,
                    mobileNo: user.data.mobileNo
                });
            }

            this.nationalHoliday = natHolidays.data || [];
            this.loaderService.display(false);
            const arr = [];
            if (this.nationalHoliday != null) {
                for (let i = 0; i < this.nationalHoliday.length; i++) {
                    arr.push(
                        {
                            title: this.nationalHoliday[i].description,
                            start: new Date(this.nationalHoliday[i].holidayDate),
                            holidayId: this.nationalHoliday[i].holidayId,
                            allDay: true,
                            backgroundColor: '#f48222'
                        }
                    );
                }
            }

            this.userLeave = userHolidays.data.filter(x => x.status === 'APPROVED') || [];
            if (this.userLeave != null) {
                for (let k = 0; k < this.userLeave.length; k++) {
                    const getDaysArr = this.getDatesBetweenDates(this.userLeave[k].startDate, this.userLeave[k].endDate);
                    for (let j = 0; j < getDaysArr.length; j++) {
                        arr.push(
                            {
                                title: this.userLeave[k].description,
                                start: new Date(getDaysArr[j]),
                                holidayId: this.userLeave[k].leaveId,
                                allDay: true,
                                backgroundColor: '#f3300d'
                            }
                        );
                    }
                }
            }

            this.officeHoliday = officeHolidays.data || [];
            if (this.officeHoliday != null) {
                for (let l = 0; l < this.officeHoliday.length; l++) {
                    const getDaysArray = this.getDatesBetweenDates(this.officeHoliday[l].fromDate, this.officeHoliday[l].toDate);
                    for (let m = 0; m < getDaysArray.length; m++) {
                        arr.push(
                            {
                                title: this.officeHoliday[l].officeTimingType,
                                start: new Date(getDaysArray[m]),
                                holidayId: this.officeHoliday[l].leaveId,
                                allDay: true,
                                backgroundColor: '#1709d8'
                            }
                        );
                    }
                }
            }
            for (let n = 0; n < arr.length; n++) {
                this.calendarEvents.push(arr[n]);
            }
            this.cdRef.detectChanges();
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

      getDatesBetweenDates(startDate, endDate) {
      const dates = [],
        addDays = function(days) {
            const date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
        let currentDate = this.formatDate(startDate);
        endDate = this.formatDate(endDate);
        while (currentDate <= endDate) {
          dates.push(currentDate);
          currentDate = this.formatDate(addDays.call(currentDate, 1));
        }
        return dates;
      }

      formatDate(date) {
        const d = new Date(date), year = d.getFullYear();
        let month = '' + (d.getMonth() + 1), day = '' + d.getDate();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
    }

    setProfileImages() {
        this.restService.getDisplayProfileImage(this.userId).subscribe(response => {
            const reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onload = (_event) => {
                this.url = reader.result;
            };
        });
    }

    ngAfterViewInit() {
        this.cdRef.detectChanges();
    }
}

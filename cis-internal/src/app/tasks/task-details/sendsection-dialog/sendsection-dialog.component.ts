import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUser } from '../../../interface/user.interface';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-sendsection-dialog',
  templateUrl: './sendsection-dialog.component.html',
  styleUrls: ['./sendsection-dialog.component.css']
})
export class SendsectionDialogComponent implements OnInit {

  users: IUser[];
  isSpinnerVisible = false;
  public assignedFilteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public assignedFilteredSection: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  assignSection;
  assignUser;
  notes = '';
  form: FormGroup;
  form2: FormGroup;
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  title: string;
  @ViewChild('searchUserSelect') searchUserSelect: MatSelect;
  public searchUserFilterCtrl: FormControl = new FormControl();
  protected _onDestroySearchUser = new Subject<void>();

  @ViewChild('searchSectionSelect') searchSectionSelect: MatSelect;
  public searchSectionFilterCtrl: FormControl = new FormControl();
  protected _onDestroySearchSection = new Subject<void>();
  tooltipText: any;
  sections: any [] = [];
  constructor(public dialogRef: MatDialogRef<SendsectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private restService: RestcallService,
    private snackbar: SnackbarService, private loaderService: LoaderService, private router: Router) {

      this.form = this.fb.group({
        loggedInUser: this.userId,
        notes: ['', Validators.required],
        reassignedToUser: ['', Validators.required],
        reassignedToSection: ['', Validators.required]
    });
     }

  ngOnInit(): void {
    this.initialise();
  }

  initialise() {
    this.assignUser = '';
    this.notes = '';
    this.restService.getListItems(19).subscribe((section: any) => {
      this.sections = section.data;
      this.assignedFilteredSection.next(this.sections.slice());
      this.searchSectionFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroySearchUser))
      .subscribe(() => {
          this.filterSeachSection();
      });
    });
  }


get getAssignSection() {
  return this.form.get('reassignedToSection');
}



filterSections(value: string) {
const filterValue = value.toLowerCase();
return this.sections.filter(section => (section.caption).toLowerCase().includes(filterValue));
}


displaySectionfn(section) {
return section ? (section.caption) : '';
}

protected filterSeachSection() {
if (!this.sections) {
    return;
}
let search = this.searchSectionFilterCtrl.value;
if (!search) {
    this.assignedFilteredSection.next(this.sections.slice());
    return;
} else {
    search = search.toLowerCase();
}
this.assignedFilteredSection.next(
    this.sections.filter(value => (value.caption).toLowerCase().indexOf(search) > -1)
);
}
assignedSectionSelected(event) {
this.assignSection = event.value;



this.restService.getManagerBySectionAndProvince(this.data.provinceId, this.assignSection.itemId).subscribe((res: any) => {
    this.users = res.data;
        this.assignedFilteredUsers.next(this.users.slice());
        this.isSpinnerVisible = false;
        this.searchUserFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroySearchUser))
        .subscribe(() => {
            this.filterSeachUser();
          });
});
}



  get getAssignUser() {
    return this.form.get('reassignedToUser');
}



filterUsers(value: string) {
  const filterValue = value.toLowerCase();
  return this.users.filter(user => (user.userName).toLowerCase().includes(filterValue));
}


displayFn(user) {
  return user ? (user.userName) : '';
}

protected filterSeachUser() {
  if (!this.users) {
      return;
  }
  let search = this.searchUserFilterCtrl.value;
  if (!search) {
      this.assignedFilteredUsers.next(this.users.slice());
      return;
  } else {
      search = search.toLowerCase();
  }
  this.assignedFilteredUsers.next(
      this.users.filter(value => (value.userName).toLowerCase().indexOf(search) > -1)
  );
}
assignedUserSelected(event) {
  this.assignUser = event.value;
}


  submit() {
    const arr = [];
    arr.push(this.data.actionId);
    const payload = {
      actionIds: arr,
      loggedInUser: this.userId,
      notes: this.notes,
      reassignedToUser: this.assignUser.userId
    };
    this.loaderService.display(true);
    this.restService.sendToSectionWorkflow(payload).subscribe((res: any) => {
      this.loaderService.display(false);
      if (res.code === 50000) {
          this.snackbar.openSnackBar('Something went wrong', 'Error');
      } else {
          this.snackbar.openSnackBar('Sent to action', 'Success');
          this.dialogRef.close();
          this.router.navigate(['tasks/task-list']);
      }
  }, error => {
      this.loaderService.display(false);
  });
  }

}

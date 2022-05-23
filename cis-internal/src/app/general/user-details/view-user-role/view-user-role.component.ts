import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-view-user-role',
  templateUrl: './view-user-role.component.html',
  styleUrls: ['./view-user-role.component.css']
})
export class ViewUserRoleComponent implements OnInit {

  provinceId: any;
  roleId: any;
  provinces: any;
  roles: any;
  rolesInfo: any = [];
  roleForm: FormGroup;
  sections: any;
  sectionId: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(public dialogRef: MatDialogRef<ViewUserRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService,
    private datePipe: DatePipe, private loaderService: LoaderService,
    private formBuilder: FormBuilder) {
    dialogRef.disableClose = true;
    this.roleForm = this.formBuilder.group({
      'isPrimary': 0,
      'provinceId': [''],
      'provinceName': [''],
      'roleId': [''],
      'roleName': [''],
      'sectionItemId': [''],
      'sectionName': [''],
      'userId': this.data.userId,
      'userRoleId': 0
    });
  }

  ngOnInit(): void {
    this.loaderService.display(true);
    forkJoin([
      this.restService.getUserRole(this.data.userId),
      // this.restService.getRoles(this.data.userType),
      this.restService.getProvinces(),
      this.restService.getListItems(19)
    ]).subscribe(([userRoles, provinces, section]) => {
      // this.roles = roles.data;
      // this.roles = this.roles.filter(x => x.roleName !== 'National System Administrator');
      this.provinces = provinces.data;
      this.sections = section.data;
      if (this.data.state === 'Add') {
        for (let j = 0; j < userRoles.data.length; j++) {
          this.rolesInfo.push(userRoles.data[j].roleId);
        }
        // this.roles = this.roles.filter((role) => !this.rolesInfo.includes(role.roleId));
      }

      if (this.data.role !== null) {
        this.roleForm.patchValue({
          'isPrimary': this.data.role.isPrimary,
          'provinceId': this.data.role.provinceId,
          'provinceName': this.data.role.provinceName,
          'roleId': this.data.role.roleId,
          'roleName': this.data.role.roleName,
          'sectionItemId': this.data.role.sectionItemId,
          'sectionName': this.data.role.sectionName,
          'userId': this.data.userId,
          'userRoleId': this.data.role.userRoleId
        });
        for (let i = 0; i < userRoles.data.length; i++) {
          if (userRoles.data[i].roleId !== this.data.role.roleId) {
            this.rolesInfo.push(userRoles.data[i].roleId);
          }
        }
        this.provinceId = this.data.role.provinceId;
        this.sectionId = this.data.role.sectionItemId;
        this.restService.listAllRolesBySectionId(this.sectionId).subscribe((roles) => {
          this.roles = roles.data;
          this.roles = this.roles.filter(x => x.roleName !== 'National System Administrator');
          this.roleId = this.data.role.roleId;
          this.roleForm.patchValue({
            'roleId': this.data.role.roleId,
            'roleName': this.data.role.roleName,
          });
          this.loaderService.display(false);
        }, error => {
          this.loaderService.display(false);
        });
        // this.roles = this.roles.filter((role) => !this.rolesInfo.includes(role.roleId));
      }
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  createUserRole() {
    this.loaderService.display(true);
    this.restService.saveUserRole(this.roleForm.value).subscribe((res: any) => {
      this.snackbar.openSnackBar(`Role ${this.data.state}ed Successfully`, 'Success');
      this.loaderService.display(false);
      this.dialogRef.close();
    }, error => {
      this.loaderService.display(false);
    });
  }

  getRoleBysectionId(event) {
    this.restService.listAllRolesBySectionId(event.value).subscribe((roles) => {
      this.roles = roles.data;
      this.roles = this.roles.filter(x => x.roleName !== 'National System Administrator');
    }, error => {
    });
  }
}

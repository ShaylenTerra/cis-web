import {Component, OnInit} from '@angular/core';
import {forkJoin} from 'rxjs';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import * as enums from './../../constants/enums';

@Component({
    selector: 'app-role-access',
    templateUrl: './role-access.component.html',
    styleUrls: ['./role-access.component.css']
})
export class RoleAccessComponent implements OnInit {
    internalRoles: Array<Role> = [];
    externalRoles: Array<Role> = [];
    rolePrevileges: Array<PModel>;
    selectedRole = '';
    selectedExternalRole = '';
    selectedInternalRole = '';
    selectedPrev: PrivilegesModel;
    mstPrivileges: Array<PrivilegesModel> = [];
    bindPrivileges: Array<PrivilegesModel> = [];
    isSpinnerVisible = false;
    usertype = '3';
    resetCheckbox = false;

    constructor(private snackbar: SnackbarService, private restService: RestcallService) {

    }

    ngOnInit() {
        this.loadInitials();
    }

    loadInitials() {
        forkJoin([
            this.restService.getAllSiteRolesWithAllPrivileges(),
            this.restService.getRoles('EXTERNAL'),
            this.restService.getRoles('INTERNAL'),
            this.restService.getAllSiteMap()
        ]).subscribe(([assignedPrivilages, extRole, intRoles, siteMap]) => {
            this.rolePrevileges = assignedPrivilages.data;
            this.internalRoles = intRoles.data;
            this.externalRoles = extRole.data;
            this.mstPrivileges = siteMap.data;

        });

    }

    updateRoles() {

        this.isSpinnerVisible = true;
        this.usertype = '3';
        this.selectedInternalRole = '';
        this.selectedExternalRole = '';
        this.selectedRole = '';
        const payload: Array<PModel> = this.rolePrevileges;

        this.restService.updateSiteMapRole(payload).subscribe(async (result) => {
                this.isSpinnerVisible = false;
            },
            error => {
                this.isSpinnerVisible = false;
                this.snackbar.openSnackBar('Unknown error while updating information.', 'Error');
            });

    }

    roleChange(ut) {
        this.usertype = ut;
        this.bindPrivileges = this.mstPrivileges.filter(mp => mp.userType === this.usertype);
    }

    userTypeSelected($event) {
        this.usertype = $event.index === 0 ? '3' : '4';
        this.bindPrivileges = this.mstPrivileges.filter(mp => mp.userType === this.usertype);
    }

    SetPrivilege(eData) {
        if (this.usertype === '3') {
            this.selectedRole = this.selectedInternalRole;
        } else if (this.usertype === '4') {
            this.selectedRole = this.selectedExternalRole;
        } else {
            this.selectedRole = '';
        }

        if (this.selectedRole !== '') {
            if (eData.source.checked) {
                // if checked then push in the array
                this.rolePrevileges.find(ip => ip.roleName === this.selectedRole).privileges.push(eData.source.value);
            } else {
                // else remove from the array
                const objIndex = this.rolePrevileges.find(ip => ip.roleName === this.selectedRole)
                    .privileges.findIndex(pr => pr.id === eData.source.value.id);
                if (objIndex > -1) {
                    this.rolePrevileges.find(ip => ip.roleName === this.selectedRole).privileges
                        .splice(objIndex, 1);
                }

            }
        }


    }

    isAssigned(preId, roleName) {
        const selectedPriv = this.rolePrevileges.find(ip => ip.roleName === roleName).privileges.findIndex(pr => pr.id === preId);
        return selectedPriv > -1 ? true : false;
    }
}

interface Role {
    roleId: number;
    roleName: string;
    userTypeItemId: number;
    description: string;
    isActive: number;
    roleCode: string;
    privileges: [];
}

interface PModel {
    roleName: string;
    privileges: Array<PrivilegesModel>;
}

interface PrivilegesModel {
    name: string;
    id: string;
    userType: string;
    icon: string;
    route: string;
}


import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { QueryComponent } from './queries/query/query.component';
import { MyRequestsComponent } from './requests/my-requests/my-requests.component';
import { QueryDetailComponent } from './queries/query-detail/query-detail.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskDetailsComponent } from './tasks/task-details/task-details.component';
import { ListManagementComponent } from './config/list-management/list-management.component';
import { FaqComponent } from './general/faq/faq.component';
import { MapViewerComponent } from './general/map-viewer/map-viewer.component';
import { RequestsChartsComponent } from './general/requests-charts/requests-charts.component';
import { OfficeTimingsComponent } from './general/office-timings/office-timings.component';
import { HolidayCalenderComponent } from './general/holiday-calender/holiday-calender.component';
import { RoleAccessComponent } from './general/role-access/role-access.component';
import { DataViewerComponent } from './general/data-viewer/data-viewer.component';
import { ReportsComponent } from './general/reports/reports.component';
import { SearchPageComponent } from './search/search-page/search-page.component';
import { WfStudioComponent } from './general/wf-studio/wf-studio.component';
import { SearchConfigComponent } from './general/search-config/search-config.component';
import { LandProfileComponent } from './land-profile/land-profile.component';
import { TaskProfileComponent } from './task-profile/task-profile.component';
import { CartPageComponent } from './search/cart-page/cart-page.component';
import { SearchDetailsComponent } from './search/search-details/search-details.component';
import { DeliveryPageComponent } from './search/delivery-page/delivery-page.component';
import { FeeConfigComponent } from './general/fee-config/fee-config.component';
import { DelegationComponent } from './general/delegation/delegation.component';
import { LeaveCalendarComponent } from './general/leave-calendar/leave-calendar.component';
import { ManageHomePageComponent } from './manage-home-page/manage-home-page.component';
import { PlsUsersComponent } from './general/pls-users/pls-users.component';
import { InternalUsersComponent } from './general/internal-users/internal-users.component';
import { ExternalUsersComponent } from './general/external-users/external-users.component';
import { TemplateComponent } from './general/template/template.component';
import { PrePackagesComponent } from './pre-packages/pre-packages.component';
import { MySubscriptionsComponent } from './general/subscriptions/my-subscriptions/my-subscriptions.component';
import { OfficeTimingsListComponent } from './general/office-timings-list/office-timings-list.component';
import { HolidayCalendarListComponent } from './general/holiday-calendar-list/holiday-calendar-list.component';
import { OcrComponent } from './general/ocr/ocr.component';
import { DataViewer2Component } from './general/data-viewer2/data-viewer2.component';
import { FeeConfig1Component } from './general/fee-config1/fee-config1.component';
import { ReassignComponent } from './general/reassign/reassign.component';
import { PrepackageDataConfigurationComponent } from './general/prepackage-data-configuration/prepackage-data-configuration.component';
import { ReviewProcessComponent } from './general/review-process/review-process.component';
import { WmsConfigurationComponent } from './general/wms-configuration/wms-configuration.component';
import { UserDetailsComponent } from './general/user-details/user-details.component';
import { ArchitectUsersComponent } from './general/architect-users/architect-users.component';
import { SystemConfigComponent } from './general/system-config/system-config.component';
import { AuthGuard } from './guard/auth.guard';
import { SearchDetailsNgiComponent } from './search/search-details-ngi/search-details-ngi.component';
import { ReservationEmulatorComponent } from './emulator/reservation-emulator/reservation-emulator.component';
import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
import { ReservationDraftComponent } from './reservation/reservation-draft/reservation-draft.component';
import { ReservationTaskComponent } from './reservation/reservation-task/reservation-task.component';
import { TaskDetailReservationComponent } from './reservation/task-detail-reservation/task-detail-reservation.component';
import { ReservationTransferComponent } from './reservation/reservation-transfer/reservation-transfer.component';
import { LodgementListComponent } from './lodgement/lodgement-list/lodgement-list.component';
import { LodgementDraftComponent } from './lodgement/lodgement-draft/lodgement-draft.component';
import { LodgementTaskComponent } from './lodgement/lodgement-task/lodgement-task.component';
import { TaskDetailLodgementComponent } from './lodgement/task-detail-lodgement/task-detail-lodgement.component';
import { ExaminationListComponent } from './examination/examination-list/examination-list/examination-list.component';
export const AppRoutes: Routes = [
    {
        path: '',
        component: AppBlankComponent,
        children: [
            {
                path: '',
                redirectTo: '/authentication/login',
                pathMatch: 'full'
            },
            {
                path: 'authentication',
                loadChildren: './authentication/authentication.module#AuthenticationModule'
            }

        ]
    },
    {
        path: '',
        component: FullComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'home',
                component: HomeComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'land-profile',
                component: LandProfileComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'task-profile',
                component: TaskProfileComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'manage-home-page',
                component: ManageHomePageComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'pre-packages',
                children: [
                    { path: 'configure', component: PrePackagesComponent, canActivate: [AuthGuard] }
                ]
            },
            {
                path: 'queries',
                children: [
                    { path: '', redirectTo: 'my-queries', pathMatch: 'full' },
                    { path: 'my-queries', component: QueryComponent },
                    { path: 'query-detail', component: QueryDetailComponent, canActivate: [AuthGuard] }
                ]
            },
            {
                path: 'requests',
                children: [
                    { path: '', redirectTo: 'my-requests', pathMatch: 'full' },
                    { path: 'my-requests', component: MyRequestsComponent, canActivate: [AuthGuard] }
                ]
            },
            {
                path: 'tasks',
                children: [
                    { path: 'task-list', component: TaskListComponent, canActivate: [AuthGuard] },
                    { path: 'task-details', component: TaskDetailsComponent, canActivate: [AuthGuard] }
                ]
            },
            {
                path: 'config/list-management',
                component: ListManagementComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'subscriptions',
                children: [
                    { path: 'my-subscriptions', component: MySubscriptionsComponent, canActivate: [AuthGuard] },
                ]
            },
            {
                path: 'general',
                children: [
                    { path: 'faq', component: FaqComponent, canActivate: [AuthGuard] },
                    { path: 'map-viewer', component: MapViewerComponent, canActivate: [AuthGuard] },
                    { path: 'requests-charts', component: RequestsChartsComponent, canActivate: [AuthGuard] },
                    { path: 'office-timings', component: OfficeTimingsComponent, canActivate: [AuthGuard] },
                    { path: 'holiday-calender', component: HolidayCalenderComponent, canActivate: [AuthGuard] },
                    { path: 'role-access', component: RoleAccessComponent, canActivate: [AuthGuard] },
                    { path: 'data-viewer', component: DataViewerComponent, canActivate: [AuthGuard] },
                    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
                    { path: 'wf-studio', component: WfStudioComponent, canActivate: [AuthGuard] },
                    { path: 'search-config', component: SearchConfigComponent, canActivate: [AuthGuard] },
                    { path: 'fee-config', component: FeeConfigComponent, canActivate: [AuthGuard] },
                    { path: 'delegation', component: DelegationComponent, canActivate: [AuthGuard] },
                    { path: 'leave-calendar', component: LeaveCalendarComponent, canActivate: [AuthGuard] },
                    { path: 'pls-users', component: PlsUsersComponent, canActivate: [AuthGuard] },
                    { path: 'internal-users', component: InternalUsersComponent, canActivate: [AuthGuard] },
                    { path: 'external-users', component: ExternalUsersComponent, canActivate: [AuthGuard] },
                    { path: 'holiday-list', component: HolidayCalendarListComponent, canActivate: [AuthGuard] },
                    { path: 'office-timings-list', component: OfficeTimingsListComponent, canActivate: [AuthGuard] },
                    { path: 'template', component: TemplateComponent, canActivate: [AuthGuard] },

                    { path: 'ocr', component: OcrComponent, canActivate: [AuthGuard] },
                    { path: 'data-viewer2', component: DataViewer2Component, canActivate: [AuthGuard] },
                    { path: 'fee-config1', component: FeeConfig1Component, canActivate: [AuthGuard] },
                    { path: 'reassign', component: ReassignComponent, canActivate: [AuthGuard] },
                    { path: 'prepackage-data-config', component: PrepackageDataConfigurationComponent, canActivate: [AuthGuard] },
                    { path: 'review-process', component: ReviewProcessComponent, canActivate: [AuthGuard] },
                    { path: 'wms-configuration', component: WmsConfigurationComponent, canActivate: [AuthGuard] },
                    { path: 'user-detail', component: UserDetailsComponent, canActivate: [AuthGuard] },
                    { path: 'architect-users', component: ArchitectUsersComponent, canActivate: [AuthGuard] },
                    { path: 'system-configuration', component: SystemConfigComponent, canActivate: [AuthGuard] }
                ]
            },
            {
                path: 'search',
                children: [
                    { path: 'search-page', component: SearchPageComponent, canActivate: [AuthGuard] },
                    { path: 'cart-page', component: CartPageComponent, canActivate: [AuthGuard] },
                    { path: 'search-details', component: SearchDetailsComponent, canActivate: [AuthGuard] },
                    { path: 'search-details-ngi', component: SearchDetailsNgiComponent, canActivate: [AuthGuard] },
                    { path: 'delivery-page', component: DeliveryPageComponent, canActivate: [AuthGuard] }
                ]
            },
            {
                path: 'emulator',
                children: [
                    { path: 'reservation-emulator', component: ReservationEmulatorComponent, canActivate: [AuthGuard] }
                ]
            },
            {
                path: 'reservation',
                children: [
                    { path: 'reservation-list', component: ReservationListComponent, canActivate: [AuthGuard] },
                    { path: 'reservation-draft', component: ReservationDraftComponent, canActivate: [AuthGuard] },
                    { path: 'reservation-task', component: ReservationTaskComponent, canActivate: [AuthGuard] },
                    { path: 'task-detail-reservation', component: TaskDetailReservationComponent, canActivate: [AuthGuard] },
                    { path: 'reservation-transfer', component: ReservationTransferComponent, canActivate: [AuthGuard] }
                ]
            },
            {
                path: 'lodgement',
                children: [
                    { path: 'lodgement-list', component: LodgementListComponent, canActivate: [AuthGuard] },
                    { path: 'lodgement-draft', component: LodgementDraftComponent, canActivate: [AuthGuard] },
                    { path: 'lodgement-task', component: LodgementTaskComponent, canActivate: [AuthGuard] },
                    { path: 'task-detail-lodgement', component: TaskDetailLodgementComponent, canActivate: [AuthGuard] },
                ]
            },
            {
                path:'examination',
                children:[
                    {path:'examination-list',component:ExaminationListComponent,canActivate:[AuthGuard]}
                ]
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'authentication/404'
    }
];

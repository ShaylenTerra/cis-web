import { BrowserModule } from '@angular/platform-browser';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { QuillModule } from 'ngx-quill';

import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChartsModule } from 'ng2-charts';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { CommonDailogComponent } from './common-dailog/common-dailog.component';
import { AddProvinceDialogComponent } from './profile/province.dialog';
import { ProfileComponent } from './profile/profile.component';
import { MatInputModule } from '@angular/material/input';
import { RestcallService } from './services/restcall.service';
import { HomeComponent } from './home/home.component';
import { QueryComponent } from './queries/query/query.component';
import { MyRequestsComponent } from './requests/my-requests/my-requests.component';
import { QueryDetailComponent } from './queries/query-detail/query-detail.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskDetailsComponent } from './tasks/task-details/task-details.component';
import { ListManagementComponent } from './config/list-management/list-management.component';
import { AddNewDialogComponent } from './config/list-management/modal/add-new';
import { OfficeTimingsEditDialogComponent } from './general/office-timings/edit-modal/office-timing-edit.modal';
import { FaqComponent } from './general/faq/faq.component';
import { MapViewerComponent } from './general/map-viewer/map-viewer.component';
import { RequestsChartsComponent } from './general/requests-charts/requests-charts.component';
import { AgmCoreModule } from '@agm/core';
import { OfficeTimingsComponent } from './general/office-timings/office-timings.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { HolidayCalenderComponent } from './general/holiday-calender/holiday-calender.component';
import { AddNewHolidayDialogComponent } from './general/holiday-calender/add-new';
import { RoleAccessComponent } from './general/role-access/role-access.component';
import { DataViewerComponent } from './general/data-viewer/data-viewer.component';
import { ReportsComponent } from './general/reports/reports.component';
import { WfStudioComponent } from './general/wf-studio/wf-studio.component';
import { SearchConfigComponent } from './general/search-config/search-config.component';
import { LandProfileComponent } from './land-profile/land-profile.component';
import { TaskProfileComponent } from './task-profile/task-profile.component';
import { SearchPageComponent } from './search/search-page/search-page.component';
import { CartPageComponent } from './search/cart-page/cart-page.component';
import { SearchDetailsComponent } from './search/search-details/search-details.component';
import { DeliveryPageComponent } from './search/delivery-page/delivery-page.component';
import { SearchDetailsDialogComponent } from './search/search-details/search-details.dialog';
import { ConfirmDailogComponent } from './search/delivery-page/confirm-dialog';
import { FeeConfigComponent } from './general/fee-config/fee-config.component';
import { AddModalComponent } from './general/fee-config/add.modal';
import { LeaveCalendarComponent } from './general/leave-calendar/leave-calendar.component';
import { DelegationComponent } from './general/delegation/delegation.component';
import { ManageHomePageComponent } from './manage-home-page/manage-home-page.component';
import { ShareDialogComponent } from './search/search-details/share/share.modal';
import { PlsUsersComponent } from './general/pls-users/pls-users.component';
import { InternalUsersComponent } from './general/internal-users/internal-users.component';
import { ExternalUsersComponent } from './general/external-users/external-users.component';
import { TemplateComponent } from './general/template/template.component';
import { EmailModalComponent } from './tasks/task-details/modal/email-modal';
import { NewFeeModalComponent } from './general/fee-config/new-fee/new-fee-modal';
import { PrePackagesComponent } from './pre-packages/pre-packages.component';
import { MySubscriptionsComponent } from './general/subscriptions/my-subscriptions/my-subscriptions.component';
import { DetailsModalDialogComponent } from './general/modals/details-modal/details-modal.dialog';
import { ActionModalDialogComponent } from './general/modals/action-modal/action-modal.dialog';
import { HolidayCalendarListComponent } from './general/holiday-calendar-list/holiday-calendar-list.component';
import { OfficeTimingsListComponent } from './general/office-timings-list/office-timings-list.component';
import { TemplateModalDialogComponent } from './general/modals/template-modal/template-modal.dialog';
import { SendEmailModalComponent } from './tasks/task-details/modal/send-email-modal.dialog';
import { SendSMSModalComponent } from './tasks/task-details/modal/send-sms-modal.dialog';
import { PLSModalDialogComponent } from './general/modals/pls-modal/pls-modal.dialog';
import { OcrComponent } from './general/ocr/ocr.component';
import { DataViewer2Component } from './general/data-viewer2/data-viewer2.component';
import { FeeConfig1Component } from './general/fee-config1/fee-config1.component';
import { PLSAddModalDialogComponent } from './general/modals/pls-add-modal/pls-add-modal.dialog';
import { SnackbarService } from './services/snackbar.service';
import { DateDifference } from './pipes/date-difference.pipe';
import { MinuteHourPipe } from './pipes/time.pipe';
import { ReassignComponent } from './general/reassign/reassign.component';
import { ReopendialogComponent } from './tasks/task-details/reopendialog/reopendialog.component';
import { UserinfoDialogComponent } from './tasks/task-details/userinfo-dialog/userinfo-dialog.component';
import { ChangeprovinceDialogComponent } from './tasks/task-details/changeprovince-dialog/changeprovince-dialog.component';
import { ExpeditetaskDialogComponent } from './tasks/task-details/expeditetask-dialog/expeditetask-dialog.component';
import { CanceltaskDialogComponent } from './tasks/task-details/canceltask-dialog/canceltask-dialog.component';
import { ConfirmTaskComponent } from './tasks/task-details/confirm-task/confirm-task.component';
import { AddtodiaryDialogComponent } from './tasks/task-details/addtodiary-dialog/addtodiary-dialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ConfirmeventDialogComponent } from './tasks/task-list/confirmevent-dialog/confirmevent-dialog.component';
import { ConfirmDecisionComponent } from './tasks/task-details/confirm-decision/confirm-decision.component';
import { ConfirmReferralComponent } from './tasks/task-details/confirm-referral/confirm-referral.component';
import { ImageDialogComponent } from './tasks/task-details/image-dialog/image-dialog.component';
import { PrepackageDataConfigurationComponent } from './general/prepackage-data-configuration/prepackage-data-configuration.component';
import { ConfigurationDialogComponent } from './general/prepackage-data-configuration/configuration-dialog/configuration-dialog.component';
import { SearchRequestModalComponent } from './search/search-page/search-request-modal/search-request-modal.component';
import { RedirectDialogComponent } from './search/search-details/redirect/redirect.modal';
import { UtilityService } from './services/utility.service';
import { SubscriptionDialogComponent } from './pre-packages/subscription-dialog/subscription-dialog.component';
import { SupportingDocsComponent } from './search/delivery-page/supporting-docs/supporting-docs.component';
import { PreSubModalDialogComponent } from './pre-packages/prepackageSubDialog/pre-sub-modal.dialog';
import { ViewMapDialogComponent } from './search/search-details/view-map/view-map.modal';
import { MarkAsPendingComponent } from './tasks/task-details/mark-as-pending/mark-as-pending.component';
import { EditAddressComponent } from './general/template/edit-address/edit-address.component';
import { ViewdispatchComponent } from './tasks/task-details/viewdispatch/viewdispatch.component';
import { ChartModule } from 'angular2-chartjs';
import { NewLeaveComponent } from './general/leave-calendar/new-leave/new-leave.component';
import { ManagerDecisionComponent } from './general/leave-calendar/manager-decision/manager-decision.component';
import { DispatchDocComponent } from './tasks/task-details/dispatch-doc/dispatch-doc.component';
import { EmployeedetailsComponent } from './tasks/task-details/employeedetails/employeedetails.component';
import { ReviewProcessComponent } from './general/review-process/review-process.component';
import { ViewReviewInfoComponent } from './tasks/task-details/view-review-info/view-review-info.component';
import { AllNotificationComponent } from './home/all-notification/all-notification.component';
import { AddrolesComponent } from './config/list-management/addRoles/addroles.component';
import { LandprofilenoteDialogComponent } from './land-profile/landprofilenote-dialog/landprofilenote-dialog.component';
import { MyRequestDialogComponent } from './general/data-viewer/my-request-dialog/my-request-dialog.component';
import { DataRequestDialogComponent } from './general/data-viewer/data-request-dialog/data-request-dialog.component';
import { WmsConfigurationComponent } from './general/wms-configuration/wms-configuration.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
// import {AgGridModule} from 'ag-grid-angular';
import { RequesterinfoDialogComponent } from './task-profile/requesterinfo-dialog/requesterinfo-dialog.component';
import { InforequestitemDialogComponent } from './task-profile/inforequestitem-dialog/inforequestitem-dialog.component';
import { InvoiceDetailDialogComponent } from './task-profile/invoice-detail-dialog/invoice-detail-dialog.component';
import { PaymentDetailDialogComponent } from './task-profile/payment-detail-dialog/payment-detail-dialog.component';
import { DispatchDetailDialogComponent } from './task-profile/dispatch-detail-dialog/dispatch-detail-dialog.component';
import { SubscriptiondialogComponent } from './general/subscriptions/subscriptiondialog/subscriptiondialog.component';
import { TimelineDialogComponent } from './land-profile/timeline-dialog/timeline-dialog.component';
import { RelatedDataComponent } from './land-profile/related-data/related-data.component';
// import 'ag-grid-enterprise';
import { HighlightPipe } from './pipes/highlight.pipe';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';
import { AuthGuard } from './guard/auth.guard';
import { UserDetailsComponent } from './general/user-details/user-details.component';
import { ArchitectUsersComponent } from './general/architect-users/architect-users.component';
import { ViewUserRoleComponent } from './general/user-details/view-user-role/view-user-role.component';
import { SystemConfigComponent } from './general/system-config/system-config.component';
import { SysConfigDialogComponent } from './general/system-config/sys-config-dialog/sys-config-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ArchitectAddModalDialogComponent } from './general/modals/architect-add-modal/architect-add-modal.dialog';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ProfileImageDialogComponent } from './profile/profile-image/profile-image.modal';
import { ReferralInputDialogComponent } from './tasks/task-details/referralinput-dialog/referralinput-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { TempdialogComponent } from './general/template/tempdialog/tempdialog.component';
import { SendsectionDialogComponent } from './tasks/task-details/sendsection-dialog/sendsection-dialog.component';
import { AddtocartDialogComponent } from './search/search-page/addtocart-dialog/addtocart-dialog.component';
import { PasswordConfirmDialogComponent } from './general/user-details/password-confirm-dialog/password-confirm-dialog.component';
import { ExistingDialogComponent } from './search/search-details/existing/existing.modal';
import { WarningDialogComponent } from './authentication/warning-dialog/warning-dialog.component';
import { SearchDetailsNgiComponent } from './search/search-details-ngi/search-details-ngi.component';
import { AddtocartNgiDialogComponent } from './search/search-page/addtocart-ngi-dialog/addtocart-ngi-dialog.component';
import { DefaultListDialogComponent } from './config/list-management/default-list-dialog/default-list-dialog.component';
import { ReservationEmulatorComponent } from './emulator/reservation-emulator/reservation-emulator.component';
import { OfficeConfigDialogComponent } from './general/system-config/office-config-dialog/office-config-dialog.component';
import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
import { ReservationDraftDialogComponent } from './reservation/reservation-list/reservation-draft-dialog/reservation-draft-dialog.component';
import { ReservationDraftComponent } from './reservation/reservation-draft/reservation-draft.component';
import { BarRatingModule } from 'ngx-bar-rating';
import { ReservationConfigDialogComponent } from './general/system-config/reservation-config-dialog/reservation-config-dialog.component';
import { LandParcelComponent } from './reservation/land-parcel/land-parcel.component';
import { AddStepDialogComponent } from './reservation/land-parcel/add-step-dialog/add-step-dialog.component';
import { ReservationConfirmDialogComponent } from './reservation/reservation-draft/reservation-confirm-dialog/reservation-confirm-dialog.component';
import { OfficeLocationDialogComponent } from './general/system-config/officelocation-confirm-dialog/officelocation-confirm-dialog.component';
// tslint:disable-next-line:max-line-length
import { ReservationPreviewDialogComponent } from './reservation/reservation-draft/reservation-preview/reservation-preview-dialog.component';
import { SearchMapDialogComponent } from './reservation/land-parcel/search-map-dialog/search-map-dialog.component';
import { DeletePropertyDialogComponent } from './reservation/land-parcel/delete-property-dialog/delete-property-dialog.component';
import { SafeHtmlPipe } from './pipes/safehtml.pipe';
import { ReservationTaskComponent } from './reservation/reservation-task/reservation-task.component';
import { AnnexureReservationComponent } from './reservation/annexure-reservation/annexure-reservation.component';
import { RequestflowReservationComponent } from './reservation/requestflow-reservation/requestflow-reservation.component';
import { ApplicantReservationComponent } from './reservation/applicant-reservation/applicant-reservation.component';
import { ApplicationReservationComponent } from './reservation/application-reservation/application-reservation.component';
import { OutcomeReservationComponent } from './reservation/outcome-reservation/outcome-reservation.component';
import { TaskDetailReservationComponent } from './reservation/task-detail-reservation/task-detail-reservation.component';
import { ReservationDecisionComponent } from './reservation/reservation-decision/reservation-decision.component';
import { ActionReservationComponent } from './reservation/action-reservation/action-reservation.component';
import { ReservationChartComponent } from './general/requests-charts/reservation-chart/reservation-chart.component';
import { DetailReservationComponent } from './reservation/detail-reservation/detail-reservation.component';
import { UpdateCategoryComponent } from './config/list-management/update-category/update-category.component';
import { AcknowledgementLetterComponent } from './reservation/acknowledgement-letter/acknowledgement-letter.component';
import { AddAcknowledgementComponent } from './reservation/acknowledgement-letter/add-acknowledgement/add-acknowledgement.component';
import { DeleteConditionComponent } from './reservation/acknowledgement-letter/delete-condition/delete-condition.component';
import { ReferralInputComponent } from './reservation/referral-input/referral-input.component';
import { ViewLandMapDialogComponent } from './reservation/land-parcel/view-land-map-dialog/view-land-map-dialog.component';
import { ReservationTransferComponent } from './reservation/reservation-transfer/reservation-transfer.component';
import { LandInfoComponent } from './reservation/land-parcel/land-info/land-info.component';
import { AdvanceLandSearchComponent } from './reservation/land-parcel/advance-land-search/advance-land-search.component';
import { LodgementListComponent } from './lodgement/lodgement-list/lodgement-list.component';
import { LodgementDraftDialogComponent } from './lodgement/lodgement-list/lodgement-draft-dialog/lodgement-draft-dialog.component';
import { LodgementDraftComponent } from './lodgement/lodgement-draft/lodgement-draft.component';
import { LodgementPreviewDialogComponent } from './lodgement/lodgement-draft/lodgement-preview-dialog/lodgement-preview-dialog.component';
import { LodgementConfirmDialogComponent } from './lodgement/lodgement-draft/lodgement-confirm-dialog/lodgement-confirm-dialog.component';
import { ApplicantLodgementComponent } from './lodgement/applicant-lodgement/applicant-lodgement.component';
import { ApplicationLodgementComponent } from './lodgement/application-lodgement/application-lodgement.component';
import { LodgementDocumentComponent } from './lodgement/lodgement-document/lodgement-document.component';
import { AnnexureLodgementComponent } from './lodgement/annexure-lodgement/annexure-lodgement.component';
import { PaymentDetailsComponent } from './lodgement/payment-details/payment-details.component';
import { LodgementDocumentDialogComponent } from './lodgement/lodgement-document/lodgement-document-dialog/lodgement-document-dialog.component';
import { PaymentViewDetailsDialogComponent } from './lodgement/payment-details/payment-view-details-dialog/payment-view-details-dialog.component';
import { UploadLodgeDocDialogComponent } from './lodgement/lodgement-document/upload-lodge-doc-dialog/upload-lodge-doc-dialog.component';
import { VerifyPaymentDialogComponent } from './lodgement/payment-details/verify-payment-dialog/verify-payment-dialog.component';
import { NotifyApplicantDialogComponent } from './lodgement/payment-details/notify-applicant-dialog/notify-applicant-dialog.component';
import { LodgementChartComponent } from './general/requests-charts/lodgement-chart/lodgement-chart.component';
import { TransfereeDetailsComponent } from './reservation/transferee-details/transferee-details.component';
import { TransferDetailsComponent } from './reservation/transfer-details/transfer-details.component';
import { ReservationTransferPreviewComponent } from './reservation/reservation-draft/reservation-transfer-preview/reservation-transfer-preview.component';
import { AnnexureTransferComponent } from './reservation/annexure-transfer/annexure-transfer.component';
import { FeedbackDialogComponent } from './reservation/applicant-reservation/feedback-dialog/feedback-dialog.component';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { ReservationTransferTaskPreviewComponent } from './task-profile/reservation-transfer-task-preview/reservation-transfer-task-preview.component';
import { DeleteDraftStepDialogComponent } from './reservation/land-parcel/delete-draft-step-dialog/delete-draft-step-dialog.component';
import { MessageDialogComponent } from './reservation/reservation-task/message-dialog/message-dialog.component';
import {NgxPrintModule} from 'ngx-print';
import { LodgementTaskComponent } from './lodgement/lodgement-task/lodgement-task.component';
import { SummaryLodgementComponent } from './lodgement/summary-lodgement/summary-lodgement.component';
import { TaskDetailLodgementComponent } from './lodgement/task-detail-lodgement/task-detail-lodgement.component';
import { ActionLodgementomponent } from './lodgement/lodgement-task/action-lodgement/action-lodgement.component';
import { LodgementDecisionComponent } from './lodgement/lodgement-decision/lodgement-decision.component';
import { LodgementTaskPreviewComponent } from './task-profile/lodgement-task-preview/lodgement-task-preview.component';
import { BatchDetailsComponent } from './lodgement/batch-details/batch-details.component';
import { NumberingComponent } from './lodgement/numbering/numbering.component';
import { LodgementReferralInputComponent } from './lodgement/lodgement-referral-input/lodgement-referral-input.component';
import { RequestflowLodgementComponent } from './lodgement/requestflow-lodgement/requestflow-lodgement.component';
import { LodgementDispatchComponent } from './lodgement/lodgement-dispatch/lodgement-dispatch.component';
import { AssignNumberDialogComponent } from './lodgement/numbering/assign-number-dialog/assign-number-dialog.component';
import { ExaminationListComponent } from './examination/examination-list/examination-list/examination-list.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelSpeed: 2,
    wheelPropagation: true
};

@NgModule({
    declarations: [
        AppComponent,
        FullComponent,
        AppHeaderComponent,
        SpinnerComponent,
        AppBlankComponent,
        AppSidebarComponent,
        CommonDailogComponent,
        AddProvinceDialogComponent,
        AddNewDialogComponent,
        OfficeTimingsEditDialogComponent,
        AddNewHolidayDialogComponent,
        ProfileComponent,
        HomeComponent,
        QueryComponent,
        MyRequestsComponent,
        QueryDetailComponent,
        TaskListComponent,
        TaskDetailsComponent,
        ListManagementComponent,
        FaqComponent,
        MapViewerComponent,
        RequestsChartsComponent,
        OfficeTimingsComponent,
        HolidayCalenderComponent,
        RoleAccessComponent,
        DataViewerComponent,
        ReportsComponent,
        WfStudioComponent,
        SearchConfigComponent,
        LandProfileComponent,
        TaskProfileComponent,
        SearchPageComponent,
        ConfirmDailogComponent,
        CartPageComponent,
        SearchDetailsComponent,
        DeliveryPageComponent,
        SearchDetailsDialogComponent,
        FeeConfigComponent,
        AddModalComponent,
        LeaveCalendarComponent,
        DelegationComponent,
        ManageHomePageComponent,
        ShareDialogComponent,
        EmailModalComponent,
        NewFeeModalComponent,
        PlsUsersComponent,
        InternalUsersComponent,
        ExternalUsersComponent,
        TemplateComponent,
        PrePackagesComponent,
        MySubscriptionsComponent,
        DetailsModalDialogComponent,
        ActionModalDialogComponent,
        HolidayCalendarListComponent,
        OfficeTimingsListComponent,
        TemplateModalDialogComponent,
        SendEmailModalComponent,
        SendSMSModalComponent,
        PLSModalDialogComponent,
        OcrComponent,
        DataViewer2Component,
        FeeConfig1Component,
        PLSAddModalDialogComponent,
        DateDifference,
        MinuteHourPipe,
        ReassignComponent,
        ReopendialogComponent,
        UserinfoDialogComponent,
        ChangeprovinceDialogComponent,
        ExpeditetaskDialogComponent,
        CanceltaskDialogComponent,
        ConfirmTaskComponent,
        AddtodiaryDialogComponent,
        ConfirmeventDialogComponent,
        ConfirmDecisionComponent,
        ConfirmReferralComponent,
        ImageDialogComponent,
        PrepackageDataConfigurationComponent,
        ConfigurationDialogComponent,
        SearchRequestModalComponent,
        RedirectDialogComponent,
        SubscriptionDialogComponent,
        SupportingDocsComponent,
        PreSubModalDialogComponent,
        ViewMapDialogComponent,
        MarkAsPendingComponent,
        EditAddressComponent,
        ViewdispatchComponent,
        NewLeaveComponent,
        ManagerDecisionComponent,
        DispatchDocComponent,
        EmployeedetailsComponent,
        ReviewProcessComponent,
        ViewReviewInfoComponent,
        AllNotificationComponent,
        ViewUserRoleComponent,
        AddrolesComponent,
        LandprofilenoteDialogComponent,
        DataRequestDialogComponent,
        MyRequestDialogComponent,
        WmsConfigurationComponent,
        RequesterinfoDialogComponent,
        InforequestitemDialogComponent,
        InvoiceDetailDialogComponent,
        PaymentDetailDialogComponent,
        DispatchDetailDialogComponent,
        SubscriptiondialogComponent,
        TimelineDialogComponent,
        RelatedDataComponent,
        HighlightPipe,
        UserDetailsComponent,
        ArchitectUsersComponent,
        SystemConfigComponent,
        SysConfigDialogComponent,
        ArchitectAddModalDialogComponent,
        ProfileImageDialogComponent,
        ReferralInputDialogComponent,
        TempdialogComponent,
        SendsectionDialogComponent,
        AddtocartDialogComponent,
        PasswordConfirmDialogComponent,
        ExistingDialogComponent,
        WarningDialogComponent,
        SearchDetailsNgiComponent,
        AddtocartNgiDialogComponent,
        DefaultListDialogComponent,
        ReservationEmulatorComponent,
        OfficeConfigDialogComponent,
        ReservationListComponent,
        ReservationDraftDialogComponent,
        ReservationDraftComponent,
        ReservationConfigDialogComponent,
        LandParcelComponent,
        AddStepDialogComponent,
        ReservationConfirmDialogComponent,
        OfficeLocationDialogComponent,
        ReservationPreviewDialogComponent,
        ViewLandMapDialogComponent,
        SearchMapDialogComponent,
        DeletePropertyDialogComponent,
        SafeHtmlPipe,
        ReservationTaskComponent,
        AnnexureReservationComponent,
        RequestflowReservationComponent,
        ApplicantReservationComponent,
        ApplicationReservationComponent,
        OutcomeReservationComponent,
        TaskDetailReservationComponent,
        ReservationDecisionComponent,
        ActionReservationComponent,
        ReservationChartComponent,
        DetailReservationComponent,
        UpdateCategoryComponent,
        AcknowledgementLetterComponent,
        AddAcknowledgementComponent,
        DeleteConditionComponent,
        ReferralInputComponent,
        ReservationTransferComponent,
        LandInfoComponent,
        AdvanceLandSearchComponent,
        LodgementListComponent,
        LodgementDraftDialogComponent,
        LodgementDraftComponent,
        LodgementPreviewDialogComponent,
        LodgementConfirmDialogComponent,
        ApplicantLodgementComponent,
        ApplicationLodgementComponent,
        LodgementDocumentComponent,
        AnnexureLodgementComponent,
        PaymentDetailsComponent,
        LodgementDocumentDialogComponent,
        PaymentViewDetailsDialogComponent,
        UploadLodgeDocDialogComponent,
        VerifyPaymentDialogComponent,
        NotifyApplicantDialogComponent,
        LodgementChartComponent,
        TransfereeDetailsComponent,
        TransferDetailsComponent,
        ReservationTransferPreviewComponent,
        AnnexureTransferComponent,
        FeedbackDialogComponent,
        ReservationTransferTaskPreviewComponent,
        DeleteDraftStepDialogComponent,
        MessageDialogComponent,
        LodgementTaskComponent,
        SummaryLodgementComponent,
        TaskDetailLodgementComponent,
        ActionLodgementomponent,
        LodgementDecisionComponent,
        LodgementTaskPreviewComponent,
        BatchDetailsComponent,
        NumberingComponent,
        LodgementReferralInputComponent,
        RequestflowLodgementComponent,
        LodgementDispatchComponent,
        AssignNumberDialogComponent,
        ExaminationListComponent
    ],
    imports: [
        BrowserModule,
        ChartsModule,
        BrowserAnimationsModule,
        DemoMaterialModule,
        FormsModule,
        MatInputModule,
        FlexLayoutModule,
        HttpClientModule,
        PerfectScrollbarModule,
        SharedModule,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule.forRoot(),
        RouterModule.forRoot(AppRoutes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDvrNQKyhhsYbHC_VXXZdnDXQzXn9dDxsM'
        }),
        NgxMaterialTimepickerModule,
        QuillModule.forRoot(),
        FullCalendarModule,
        ChartModule,
        NgbPaginationModule,
        // AgGridModule.withComponents([]),
        MatSelectModule,
        MatFormFieldModule,
        MatProgressBarModule,
        NgxMatSelectSearchModule,
        NgxGalleryModule,
        NgxSpinnerModule,
        NgxSkeletonLoaderModule.forRoot(),
        ImageCropperModule,
        BarRatingModule,
        NgxPrintModule
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        RestcallService,
        SnackbarService,
        UtilityService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
        DatePipe,
        CookieService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    bootstrap: [AppComponent],
    entryComponents: [
        CommonDailogComponent,
        AddProvinceDialogComponent,
        AddNewDialogComponent,
        OfficeTimingsEditDialogComponent,
        AddNewHolidayDialogComponent,
        SearchDetailsDialogComponent,
        ConfirmDailogComponent,
        AddModalComponent,
        ShareDialogComponent,
        EmailModalComponent,
        NewFeeModalComponent,
        DetailsModalDialogComponent,
        ActionModalDialogComponent,
        TemplateModalDialogComponent,
        SendEmailModalComponent,
        SendSMSModalComponent,
        PLSModalDialogComponent,
        PLSAddModalDialogComponent,
        ReopendialogComponent,
        UserinfoDialogComponent,
        ChangeprovinceDialogComponent,
        ExpeditetaskDialogComponent,
        CanceltaskDialogComponent,
        ConfirmTaskComponent,
        AddtodiaryDialogComponent,
        ConfirmeventDialogComponent,
        ConfirmDecisionComponent,
        ConfirmReferralComponent,
        ImageDialogComponent,
        ConfigurationDialogComponent,
        SearchRequestModalComponent,
        RedirectDialogComponent,
        SubscriptionDialogComponent,
        PreSubModalDialogComponent,
        ViewMapDialogComponent,
        MarkAsPendingComponent,
        EditAddressComponent,
        ViewdispatchComponent,
        NewLeaveComponent,
        ManagerDecisionComponent,
        DispatchDocComponent,
        EmployeedetailsComponent,
        ViewReviewInfoComponent,
        AllNotificationComponent,
        AddrolesComponent,
        LandprofilenoteDialogComponent,
        DataRequestDialogComponent,
        MyRequestDialogComponent,
        RequesterinfoDialogComponent,
        InforequestitemDialogComponent,
        InvoiceDetailDialogComponent,
        PaymentDetailDialogComponent,
        DispatchDetailDialogComponent,
        SubscriptiondialogComponent,
        TimelineDialogComponent,
        RelatedDataComponent,
        ViewUserRoleComponent,
        SysConfigDialogComponent,
        ArchitectAddModalDialogComponent,
        ProfileImageDialogComponent,
        ReferralInputDialogComponent,
        TempdialogComponent,
        SendsectionDialogComponent,
        AddtocartDialogComponent,
        PasswordConfirmDialogComponent,
        ExistingDialogComponent,
        WarningDialogComponent,
        AddtocartNgiDialogComponent,
        OfficeConfigDialogComponent,
        ReservationConfigDialogComponent,
        ReservationConfirmDialogComponent,
        OfficeLocationDialogComponent,
        ReservationPreviewDialogComponent,
        UpdateCategoryComponent,
        ViewLandMapDialogComponent,
        PaymentViewDetailsDialogComponent,
        UploadLodgeDocDialogComponent,
        VerifyPaymentDialogComponent,
        ReservationTransferPreviewComponent,
        ReservationTransferTaskPreviewComponent,
        DeleteDraftStepDialogComponent,
        MessageDialogComponent,
        AssignNumberDialogComponent
    ]
})
export class AppModule {
}

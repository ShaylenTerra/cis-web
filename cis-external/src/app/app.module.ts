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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RestcallService } from './services/restcall.service';
import { HomeComponent } from './home/home.component';
import { MyRequestsComponent } from './requests/my-requests/my-requests.component';
import { RequestDetailComponent } from './requests/request-detail/request-detail.component';
import { MyQueriesComponent } from './queries/my-queries/my-queries.component';
import { CreateRequestComponent } from './requests/create-request/create-request.component';
import { AssistantsComponent } from './assistants/assistants.component';
import { RequestDialogComponent } from './requests/request-dialog/request-dialog.component';
import { QueryDialogComponent } from './queries/query-dialog/query-dialog.component';
import { SearchPageComponent } from './search/search-page/search-page.component';
import { CartPageComponent } from './search/cart-page/cart-page.component';
import { SearchDetailsComponent } from './search/search-details/search-details.component';
import { DeliveryPageComponent } from './search/delivery-page/delivery-page.component';
import { SearchDetailsDialogComponent } from './search/search-details/search-details.dialog';
import { ConfirmDailogComponent } from './search/delivery-page/confirm-dialog';
import { FaqComponent } from './general/faq/faq.component';
import { MySubscriptionsComponent } from './subscriptions/my-subscriptions/my-subscriptions.component';
import { PrePackagesComponent } from './pre-packages/pre-packages.component';
import { MapViewerComponent } from './general/map-viewer/map-viewer.component';
import { ShareDialogComponent } from './search/search-details/share/share.modal';
import { HolidayCalendarComponent } from './general/holiday-calendar/holiday-calendar.component';
import { OfficeTimingsComponent } from './general/office-timings/office-timings.component';
import { AddAssistantModalDialogComponent } from './modals/add-assistant/add-assistant-modal.dialog';
import { SearchRequestModalDialogComponent } from './search/search-page/search-request-modal/search-request-modal.dialog';
import { SnackbarService } from './services/snackbar.service';
import { DateDifference } from './pipes/date-difference.pipe';
import { TrackOrderComponent } from './search/track-order/track-order.component';
import { RaiseQueryComponent } from './queries/raise-query/raise-query.component';
import { RaiseQueryModalDialogComponent } from './queries/raise-query/raise-query-modal.dialog';
import { SupportingDocsComponent } from './search/delivery-page/supporting-docs/supporting-docs.component';
import { UtilityService } from './services/utility.service';
import { RedirectDialogComponent } from './search/search-details/redirect/redirect.modal';
import { MyRequestComponent } from './my-request/my-request.component';
import { CancelDialogComponent } from './my-request/cancel-dialog/cancel-dialog.component';
import { PostqueryDialogComponent } from './queries/postquery-dialog/postquery-dialog.component';
import { SubscriptionDialogComponent } from './pre-packages/subscription-dialog/subscription-dialog.component';
import { PreSubModalDialogComponent } from './pre-packages/prepackageSubDialog/pre-sub-modal.dialog';
import { ViewMapDialogComponent } from './search/search-details/view-map/view-map.modal';
import { AuthGuard } from './guard/auth.guard';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';
import { NgbPaginationModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TAndCDialogComponent } from './authentication/register/tandc-details.dialog';
import { DecisionComponent } from './assistants/decision/decision.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ProfileImageDialogComponent } from './profile/profile-image/profile-image.modal';
import { AddtocartDialogComponent } from './search/search-page/addtocart-dialog/addtocart-dialog.component';
import { ExistingDialogComponent } from './search/search-details/existing/existing.modal';
import { WarningDialogComponent } from './authentication/warning-dialog/warning-dialog.component';
import { SearchDetailsNgiComponent } from './search/search-details-ngi/search-details-ngi.component';
import { AddtocartNgiDialogComponent } from './search/search-page/addtocart-ngi-dialog/addtocart-ngi-dialog.component';
import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
import { ReservationDraftComponent } from './reservation/reservation-draft/reservation-draft.component';
import { LandParcelComponent } from './reservation/land-parcel/land-parcel.component';
import { AddStepDialogComponent } from './reservation/land-parcel/add-step-dialog/add-step-dialog.component';
// tslint:disable-next-line:max-line-length
import { ReservationDraftDialogComponent } from './reservation/reservation-list/reservation-draft-dialog/reservation-draft-dialog.component';
// tslint:disable-next-line:max-line-length
import { ReservationConfirmDialogComponent } from './reservation/reservation-draft/reservation-confirm-dialog/reservation-confirm-dialog.component';
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
import { DetailReservationComponent } from './reservation/detail-reservation/detail-reservation.component';
import { AcknowledgementLetterComponent } from './reservation/acknowledgement-letter/acknowledgement-letter.component';
import { AddAcknowledgementComponent } from './reservation/acknowledgement-letter/add-acknowledgement/add-acknowledgement.component';
import { DeleteConditionComponent } from './reservation/acknowledgement-letter/delete-condition/delete-condition.component';
import { ReferralInputComponent } from './reservation/referral-input/referral-input.component';
import { ViewLandMapDialogComponent } from './reservation/land-parcel/view-land-map-dialog/view-land-map-dialog.component';
import { ConfirmPasswordComponent } from './home/confirm-password/confirm-password.component';
import { ChangePasswordDialogComponent } from './home/change-password-dialog/change-password-dialog.component';
import { SubscriptionViewdialogComponent } from './subscriptions/subscriptionviewdialog/subscriptionviewdialog.component';
import { AllNotificationComponent } from './home/all-notification/all-notification.component';
import { ConfirmTaskComponent } from './my-request/confirm-task/confirm-task.component'
import { TaskDetailsComponent } from './tasks/task-details/task-details.component';
import { EmailModalComponent } from './tasks/task-details/modal/email-modal';
import { SendEmailModalComponent } from './tasks/task-details/modal/send-email-modal.dialog';
import { SendSMSModalComponent } from './tasks/task-details/modal/send-sms-modal.dialog';
import { ReopendialogComponent } from './tasks/task-details/reopendialog/reopendialog.component';
import { UserinfoDialogComponent } from './tasks/task-details/userinfo-dialog/userinfo-dialog.component';
import { ChangeprovinceDialogComponent } from './tasks/task-details/changeprovince-dialog/changeprovince-dialog.component';
import { ExpeditetaskDialogComponent } from './tasks/task-details/expeditetask-dialog/expeditetask-dialog.component';
import { CanceltaskDialogComponent } from './tasks/task-details/canceltask-dialog/canceltask-dialog.component';
// import { ConfirmTaskComponent } from './tasks/task-details/confirm-task/confirm-task.component';
import { AddtodiaryDialogComponent } from './tasks/task-details/addtodiary-dialog/addtodiary-dialog.component';
import { ConfirmDecisionComponent } from './tasks/task-details/confirm-decision/confirm-decision.component';
import { ConfirmReferralComponent } from './tasks/task-details/confirm-referral/confirm-referral.component';
import { ImageDialogComponent } from './tasks/task-details/image-dialog/image-dialog.component';
import { MarkAsPendingComponent } from './tasks/task-details/mark-as-pending/mark-as-pending.component';
import { ViewdispatchComponent } from './tasks/task-details/viewdispatch/viewdispatch.component';
import { DispatchDocComponent } from './tasks/task-details/dispatch-doc/dispatch-doc.component';
import { EmployeedetailsComponent } from './tasks/task-details/employeedetails/employeedetails.component';
import { ViewReviewInfoComponent } from './tasks/task-details/view-review-info/view-review-info.component';
import { ReferralInputDialogComponent } from './tasks/task-details/referralinput-dialog/referralinput-dialog.component';
import { SendsectionDialogComponent } from './tasks/task-details/sendsection-dialog/sendsection-dialog.component';
import { LodgementListComponent } from './lodgement/lodgement-list/lodgement-list.component';
import { LodgementDraftDialogComponent } from './lodgement/lodgement-list/lodgement-draft-dialog/lodgement-draft-dialog.component';
import { LodgementDraftComponent } from './lodgement/lodgement-draft/lodgement-draft.component';
import { LodgementPreviewDialogComponent } from './lodgement/lodgement-draft/lodgement-preview-dialog/lodgement-preview-dialog.component';
import { LodgementConfirmDialogComponent } from './lodgement/lodgement-draft/lodgement-confirm-dialog/lodgement-confirm-dialog.component';
import { PaymentDetailsComponent } from './lodgement/payment-details/payment-details.component';
import { VerifyPaymentDialogComponent } from './lodgement/payment-details/verify-payment-dialog/verify-payment-dialog.component';
import { PaymentViewDetailsDialogComponent } from './lodgement/payment-details/payment-view-details-dialog/payment-view-details-dialog.component';
import { NotifyApplicantDialogComponent } from './lodgement/payment-details/notify-applicant-dialog/notify-applicant-dialog.component';
import { LodgementDocumentComponent } from './lodgement/lodgement-document/lodgement-document.component';
import { UploadLodgeDocDialogComponent } from './lodgement/lodgement-document/upload-lodge-doc-dialog/upload-lodge-doc-dialog.component';
import { LodgementDocumentDialogComponent } from './lodgement/lodgement-document/lodgement-document-dialog/lodgement-document-dialog.component';
import { ApplicationLodgementComponent } from './lodgement/application-lodgement/application-lodgement.component';
import { AnnexureLodgementComponent } from './lodgement/annexure-lodgement/annexure-lodgement.component';
import { ApplicantLodgementComponent } from './lodgement/applicant-lodgement/applicant-lodgement.component';
import { AdvanceLandSearchComponent } from './reservation/land-parcel/advance-land-search/advance-land-search.component';
import { LandInfoComponent } from './reservation/land-parcel/land-info/land-info.component';
import { AnnexureTransferComponent } from './reservation/annexure-transfer/annexure-transfer.component';
import { ReservationTransferPreviewComponent } from './reservation/reservation-draft/reservation-transfer-preview/reservation-transfer-preview.component';
import { TransferDetailsComponent } from './reservation/transfer-details/transfer-details.component';
import { TransfereeDetailsComponent } from './reservation/transferee-details/transferee-details.component';
import { DeleteDraftStepDialogComponent } from './reservation/land-parcel/delete-draft-step-dialog/delete-draft-step-dialog.component';
import { MessageDialogComponent } from './reservation/reservation-task/message-dialog/message-dialog.component';
import { FeedbackDialogComponent } from './reservation/applicant-reservation/feedback-dialog/feedback-dialog.component';
import { ProcessRequestDialogComponent } from './reservation/task-detail-reservation/process-request-dialog/process-request-dialog.component';
import { ReservationTransferComponent } from './reservation/reservation-transfer/reservation-transfer.component';
import { NgxPrintModule } from 'ngx-print';
import { SummaryLodgementComponent } from './lodgement/summary-lodgement/summary-lodgement.component';
import { LodgementTaskComponent } from './lodgement/lodgement-task/lodgement-task.component';
import { TaskDetailLodgementComponent } from './lodgement/task-detail-lodgement/task-detail-lodgement.component';
import { ActionLodgementomponent } from './lodgement/lodgement-task/action-lodgement/action-lodgement.component';
import { LodgementDecisionComponent } from './lodgement/lodgement-decision/lodgement-decision.component';
import { BatchDetailsComponent } from './lodgement/batch-details/batch-details.component';
import { NumberingComponent } from './lodgement/numbering/numbering.component';
import { AssignNumberDialogComponent } from './lodgement/numbering/assign-number-dialog/assign-number-dialog.component';
import { LodgementDispatchComponent } from './lodgement/lodgement-dispatch/lodgement-dispatch.component';
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
    ProfileComponent,
    HomeComponent,
    MyRequestsComponent,
    RequestDetailComponent,
    MyQueriesComponent,
    CreateRequestComponent,
    AssistantsComponent,
    RequestDialogComponent,
    QueryDialogComponent,
    SearchPageComponent,
    ConfirmDailogComponent,
    CartPageComponent,
    SearchDetailsComponent,
    DeliveryPageComponent,
    SearchDetailsDialogComponent,
    FaqComponent,
    MySubscriptionsComponent,
    PrePackagesComponent,
    MapViewerComponent,
    ShareDialogComponent,
    RedirectDialogComponent,
    HolidayCalendarComponent,
    OfficeTimingsComponent,
    AddAssistantModalDialogComponent,
    SearchRequestModalDialogComponent,
    DateDifference,
    TrackOrderComponent,
    RaiseQueryComponent,
    RaiseQueryModalDialogComponent,
    SupportingDocsComponent,
    MyRequestComponent,
    CancelDialogComponent,
    PostqueryDialogComponent,
    SubscriptionDialogComponent,
    PreSubModalDialogComponent,
    ViewMapDialogComponent,
    TAndCDialogComponent,
    DecisionComponent,
    SubscriptionViewdialogComponent,
    AllNotificationComponent,
    ConfirmTaskComponent,
    ConfirmDecisionComponent,
    AddtocartDialogComponent,
    ChangePasswordDialogComponent,
    ExistingDialogComponent,
    ConfirmPasswordComponent,
    WarningDialogComponent,
    SearchDetailsNgiComponent,
    AddtocartNgiDialogComponent,
    ReservationDraftComponent,
    ReservationListComponent,
    LandParcelComponent,
    AddStepDialogComponent,
    ReservationDraftDialogComponent,
    ReservationConfirmDialogComponent,
    ProfileImageDialogComponent,
    ReservationPreviewDialogComponent,
    DeletePropertyDialogComponent,
    ViewLandMapDialogComponent,
    SearchMapDialogComponent,
    SafeHtmlPipe,
    AnnexureReservationComponent,
    RequestflowReservationComponent,
    ApplicantReservationComponent,
    ApplicationReservationComponent,
    OutcomeReservationComponent,
    TaskDetailReservationComponent,
    ReservationDecisionComponent,
    ActionReservationComponent,
    DetailReservationComponent,
    AcknowledgementLetterComponent,
    AddAcknowledgementComponent,
    DeleteConditionComponent,
    ReferralInputComponent,
    ReservationTaskComponent,
    TaskDetailsComponent,
    EmailModalComponent,
    SendEmailModalComponent,
    SendSMSModalComponent,
    ReopendialogComponent,
    UserinfoDialogComponent,
    ChangeprovinceDialogComponent,
    ExpeditetaskDialogComponent,
    CanceltaskDialogComponent,
    AddtodiaryDialogComponent,
    ConfirmReferralComponent,
    ImageDialogComponent,
    MarkAsPendingComponent,
    ViewdispatchComponent,
    DispatchDocComponent,
    EmployeedetailsComponent,
    ViewReviewInfoComponent,
    ReferralInputDialogComponent,
    SendsectionDialogComponent,
    LodgementListComponent,
    LodgementDraftDialogComponent,
    LodgementDraftComponent,
    LodgementPreviewDialogComponent,
    LodgementConfirmDialogComponent,
    PaymentDetailsComponent,
    VerifyPaymentDialogComponent,
    PaymentViewDetailsDialogComponent,
    NotifyApplicantDialogComponent,
    LodgementDocumentComponent,
    UploadLodgeDocDialogComponent,
    LodgementDocumentDialogComponent,
    ApplicationLodgementComponent,
    ApplicantLodgementComponent,
    AnnexureLodgementComponent,
    AdvanceLandSearchComponent,
    LandInfoComponent,
    AnnexureTransferComponent,
    ReservationTransferPreviewComponent,
    TransferDetailsComponent,
    TransfereeDetailsComponent,
    DeleteDraftStepDialogComponent,
    MessageDialogComponent,
    FeedbackDialogComponent,
    ProcessRequestDialogComponent,
    ReservationTransferComponent,
    LodgementTaskComponent,
    SummaryLodgementComponent,
    TaskDetailLodgementComponent,
    ActionLodgementomponent,
    LodgementDecisionComponent,
    BatchDetailsComponent,
    NumberingComponent,
    AssignNumberDialogComponent,
    LodgementDispatchComponent
  ],
  imports: [
    BrowserModule,
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
    MatSlideToggleModule,
    NgbPaginationModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    NgxGalleryModule,
    NgxSpinnerModule,
    NgxSkeletonLoaderModule.forRoot(),
    QuillModule.forRoot(),
    NgbModule,
    NgxPrintModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    RestcallService,
    SnackbarService,
    // CookieService,
    UtilityService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
  entryComponents: [
    CommonDailogComponent,
    AddProvinceDialogComponent,
    QueryDialogComponent,
    RequestDialogComponent,
    SearchDetailsDialogComponent,
    ConfirmDailogComponent,
    ShareDialogComponent,
    RedirectDialogComponent,
    AddAssistantModalDialogComponent,
    SearchRequestModalDialogComponent,
    RaiseQueryModalDialogComponent,
    CancelDialogComponent,
    PostqueryDialogComponent,
    SubscriptionDialogComponent,
    PreSubModalDialogComponent,
    ViewMapDialogComponent,
    TAndCDialogComponent,
    SubscriptionViewdialogComponent,
    AllNotificationComponent,
    ConfirmTaskComponent,
    ConfirmDecisionComponent,
    AddtocartDialogComponent,
    ChangePasswordDialogComponent,
    ExistingDialogComponent,
    ConfirmPasswordComponent,
    WarningDialogComponent,
    ProfileImageDialogComponent,
    AddStepDialogComponent,
    ReservationConfirmDialogComponent,
    ReservationDraftDialogComponent,
    TaskDetailsComponent,
    EmailModalComponent,
    SendEmailModalComponent,
    SendSMSModalComponent,
    ReopendialogComponent,
    UserinfoDialogComponent,
    ChangeprovinceDialogComponent,
    ExpeditetaskDialogComponent,
    CanceltaskDialogComponent,
    AddtodiaryDialogComponent,
    ConfirmReferralComponent,
    ImageDialogComponent,
    MarkAsPendingComponent,
    ViewdispatchComponent,
    DispatchDocComponent,
    EmployeedetailsComponent,
    ViewReviewInfoComponent,
    ReferralInputDialogComponent,
    SendsectionDialogComponent,
    LodgementDraftDialogComponent,
    LodgementPreviewDialogComponent,
    LodgementConfirmDialogComponent,
    VerifyPaymentDialogComponent,
    PaymentViewDetailsDialogComponent,
    NotifyApplicantDialogComponent,
    UploadLodgeDocDialogComponent,
    LodgementDocumentDialogComponent,
    AdvanceLandSearchComponent,
    LandInfoComponent,
    DeleteDraftStepDialogComponent,
    MessageDialogComponent,
    FeedbackDialogComponent,
    ProcessRequestDialogComponent,
    AssignNumberDialogComponent
  ]
})
export class AppModule { }

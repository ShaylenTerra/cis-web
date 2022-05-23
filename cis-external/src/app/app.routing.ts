import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MyRequestsComponent } from './requests/my-requests/my-requests.component';
import { RequestDetailComponent } from './requests/request-detail/request-detail.component';
import { MyQueriesComponent } from './queries/my-queries/my-queries.component';
import { CreateRequestComponent } from './requests/create-request/create-request.component';
import { AssistantsComponent } from './assistants/assistants.component';
import { SearchPageComponent } from './search/search-page/search-page.component';
import { CartPageComponent } from './search/cart-page/cart-page.component';
import { SearchDetailsComponent } from './search/search-details/search-details.component';
import { DeliveryPageComponent } from './search/delivery-page/delivery-page.component';
import { FaqComponent } from './general/faq/faq.component';
import { MySubscriptionsComponent } from './subscriptions/my-subscriptions/my-subscriptions.component';
import { PrePackagesComponent } from './pre-packages/pre-packages.component';
import { MapViewerComponent } from './general/map-viewer/map-viewer.component';
import { OfficeTimingsComponent } from './general/office-timings/office-timings.component';
import { HolidayCalendarComponent } from './general/holiday-calendar/holiday-calendar.component';
import { TrackOrderComponent } from './search/track-order/track-order.component';
import { RaiseQueryComponent } from './queries/raise-query/raise-query.component';
import { MyRequestComponent } from './my-request/my-request.component';
import { AuthGuard } from './guard/auth.guard';
import { SearchDetailsNgiComponent } from './search/search-details-ngi/search-details-ngi.component';
// import {ReservationListComponent} from '../../../cis-internal/src/app/reservation/reservation-list/reservation-list.component';
// import {ReservationDraftComponent} from '../../../cis-internal/src/app/reservation/reservation-draft/reservation-draft.component';
import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
import { ReservationDraftComponent } from './reservation/reservation-draft/reservation-draft.component';
import { LodgementListComponent } from './lodgement/lodgement-list/lodgement-list.component';
import { LodgementDraftComponent } from './lodgement/lodgement-draft/lodgement-draft.component';
import { ReservationTaskComponent } from './reservation/reservation-task/reservation-task.component';
import { TaskDetailReservationComponent } from './reservation/task-detail-reservation/task-detail-reservation.component';
import { ReservationTransferPreviewComponent } from './reservation/reservation-draft/reservation-transfer-preview/reservation-transfer-preview.component';
import { ReservationTransferComponent } from './reservation/reservation-transfer/reservation-transfer.component';
import { LodgementTaskComponent } from './lodgement/lodgement-task/lodgement-task.component';
import { TaskDetailLodgementComponent } from './lodgement/task-detail-lodgement/task-detail-lodgement.component';

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
      },
      {
        path: 'raise-query',
        component: RaiseQueryComponent
      },
      {
        path: 'track-order',
        component: TrackOrderComponent
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
        canActivate: [AuthGuard]
      },
      {
        path: 'my-request',
        component: MyRequestComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'queries',
        children: [
          { path: '', redirectTo: 'my-queries', pathMatch: 'full' },
          { path: 'my-queries', component: MyQueriesComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'requests',
        children: [
          { path: '', redirectTo: 'my-requests', pathMatch: 'full' },
          { path: 'my-requests', component: MyRequestsComponent, canActivate: [AuthGuard] },
          { path: 'detail', component: RequestDetailComponent, canActivate: [AuthGuard] },
          { path: 'create', component: CreateRequestComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'assistants',
        component: AssistantsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'search',
        children: [
          { path: 'search-page', component: SearchPageComponent, canActivate: [AuthGuard] },
          { path: 'cart-page', component: CartPageComponent, canActivate: [AuthGuard] },
          { path: 'search-details', component: SearchDetailsComponent, canActivate: [AuthGuard] },
          { path: 'delivery-page', component: DeliveryPageComponent, canActivate: [AuthGuard] },
          { path: 'track-order', component: TrackOrderComponent, canActivate: [AuthGuard] },
          { path: 'search-details-ngi', component: SearchDetailsNgiComponent, canActivate: [AuthGuard] },
        ]
      },
      {
        path: 'general',
        children: [
          { path: 'faq', component: FaqComponent, canActivate: [AuthGuard] },
          { path: 'map-viewer', component: MapViewerComponent, canActivate: [AuthGuard] },
          { path: 'holiday-calendar', component: HolidayCalendarComponent, canActivate: [AuthGuard] },
          { path: 'office-timings', component: OfficeTimingsComponent, canActivate: [AuthGuard] }
        ]
      },
      {
        path: 'subscriptions',
        children: [
          { path: 'my-subscriptions', component: MySubscriptionsComponent, canActivate: [AuthGuard] },
        ]
      },
      {
        path: 'pre-packages',
        children: [
          { path: 'configure', component: PrePackagesComponent, canActivate: [AuthGuard] },
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
    ]
  },
  {
    path: '**',
    redirectTo: 'authentication/404'
  }
];

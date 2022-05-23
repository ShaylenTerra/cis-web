import {Routes} from '@angular/router';

import {ErrorComponent} from './error/error.component';
import {ForgotComponent} from './forgot/forgot.component';
import {LockscreenComponent} from './lockscreen/lockscreen.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ResetPasswordComponent} from './reset-password/reset-password/reset-password.component';
import {ConfirmationComponent} from './confirmation/confirmation.component';
import {FeeSimulatorComponent} from './simulator/feeSimulator/feeSimulator.component';
import {ReservationSimulatorComponent} from './simulator/reservation-simulator/reservation-simulator.component';
import {MaintenanceSimulatorComponent} from './simulator/maintenance-simulator/maintenance-simulator.component';
import {LodgementSimulatorComponent} from './simulator/lodgement-simulator/lodgement-simulator.component';
import {NgidataSimulatorComponent} from './simulator/ngidata-simulator/ngidata-simulator.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'fee-simulator',
        component: FeeSimulatorComponent
      },
      {
        path: 'reservation-simulator',
        component: ReservationSimulatorComponent
      },
      {
        path: 'maintenance-simulator',
        component: MaintenanceSimulatorComponent
      },
      {
        path: 'lodgement-simulator',
        component: LodgementSimulatorComponent
      },
      {
        path: 'ngi-data-simulator',
        component: NgidataSimulatorComponent
      },
      {
        path: '404',
        component: ErrorComponent
      },
      {
        path: 'forgot',
        component: ForgotComponent
      },
      {
        path: 'lockscreen',
        component: LockscreenComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      },
      {
        path: 'Confirmation',
        component: ConfirmationComponent
      }

    ]
  }
];

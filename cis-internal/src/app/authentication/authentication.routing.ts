import {Routes} from '@angular/router';

import {ErrorComponent} from './error/error.component';
import {ForgotComponent} from './forgot/forgot.component';
import {LockscreenComponent} from './lockscreen/lockscreen.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ResetPasswordComponent} from './reset-password/reset-password/reset-password.component';
import {ConfirmationComponent} from './confirmation/confirmation.component';
import {FeeSimulatorComponent} from './feeSimulator/feeSimulator.component';

export const AuthenticationRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'feeSimulator',
                component: FeeSimulatorComponent
            },
            {
                path: 'login',
                component: LoginComponent
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

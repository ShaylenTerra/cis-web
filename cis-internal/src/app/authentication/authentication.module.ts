import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

import {AuthenticationRoutes} from './authentication.routing';
import {ErrorComponent} from './error/error.component';
import {ForgotComponent} from './forgot/forgot.component';
import {LockscreenComponent} from './lockscreen/lockscreen.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ResetPasswordComponent} from './reset-password/reset-password/reset-password.component';
import {DemoMaterialModule} from '../demo-material-module';
import {ConfirmationComponent} from './confirmation/confirmation.component';
import { ConfirmUserComponent } from './register/confirm-user/confirm-user.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { FeeSimulatorComponent } from './feeSimulator/feeSimulator.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuthenticationRoutes),
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MatOptionModule,
        MatSelectModule,
        CommonModule,
        DemoMaterialModule,
        FlexLayoutModule,
        NgxSpinnerModule
    ],
    providers: [CookieService],
    declarations: [
        ErrorComponent,
        ForgotComponent,
        LockscreenComponent,
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
        ConfirmationComponent,
        ConfirmUserComponent,
        FeeSimulatorComponent
    ],
    entryComponents: [ConfirmUserComponent]
})
export class AuthenticationModule {
}

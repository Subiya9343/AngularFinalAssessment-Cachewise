import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { CreateAccComponent } from './Components/create-acc/create-acc.component';
import { DialogBoxComponent } from './Components/dialog-box/dialog-box.component';
import { PermissionComponent } from './Components/permission/permission.component';
import { ConfigurationComponent } from './Components/configuration/configuration.component';
import { ServicesComponent } from './Components/services/services.component';
import { CleanupComponent } from './Components/cleanup/cleanup.component';
import { GuardService } from './Guards/canActivate-guard.service';

const routes: Routes = [
  {path: '', redirectTo: 'Login', pathMatch: 'full'},
  {path: 'Login', component: LoginComponent},
  {path: 'CreateAcc', component: CreateAccComponent},
  {path:'DialogBox', component: DialogBoxComponent,canActivate: [GuardService]},
  {path:'Permission', component: PermissionComponent,canActivate: [GuardService]},
  {path:'Configuration', component: ConfigurationComponent,canActivate: [GuardService]},
  {path:'Services', component: ServicesComponent,canActivate: [GuardService]},
  {path:'CleanUp', component: CleanupComponent,canActivate: [GuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

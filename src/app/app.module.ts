import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CreateAccComponent } from './Components/create-acc/create-acc.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './Components/header/header.component';
import { RouterModule } from '@angular/router';
import { DialogBoxComponent } from './Components/dialog-box/dialog-box.component';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { PermissionComponent } from './Components/permission/permission.component';
import { ConfigurationComponent } from './Components/configuration/configuration.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ChipsModule } from 'primeng/chips';
import { ServicesComponent } from './Components/services/services.component';
import { CleanupComponent } from './Components/cleanup/cleanup.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
// import { AuthInterceptor} from './Auth/auth-interceptor.service';
import { AuthService } from './Services/auth.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AutofocusDirective } from './Directive/autofocus.directive';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { LoaderComponent } from './Utility/loader/loader.component';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateAccComponent,
    HeaderComponent,
    DialogBoxComponent,
    NavBarComponent,
    PermissionComponent,
    ConfigurationComponent,
    ServicesComponent,
    CleanupComponent,
    AutofocusDirective,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ButtonModule,
    BrowserAnimationsModule,
    CheckboxModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    CardModule,
    DropdownModule,
    InputSwitchModule,
    TableModule,
    DataViewModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    PaginatorModule,
    ChipsModule,
    DialogModule,
    ConfirmPopupModule,
    OverlayPanelModule,
    AutoCompleteModule,
    ClipboardModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({
      "projectId": "angular-final-assessment",
      "appId": "1:210966184486:web:3f99b48d24f1a46defdce7",
      "databaseURL": "https://angular-final-assessment-default-rtdb.firebaseio.com",
      "storageBucket": "angular-final-assessment.appspot.com",
      "apiKey": "YOUR_API_KEY",
      "authDomain": "angular-final-assessment.firebaseapp.com",
      "messagingSenderId": "210966184486"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    ConfirmationService,
    MessageService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

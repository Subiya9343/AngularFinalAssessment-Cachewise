import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../Model/AuthResponse';
import { Router } from '@angular/router';
import { UserDetails } from '../../Model/UserDetails';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;
  errorMessage: string | null = null; 
  authObs:Observable<AuthResponse>
  fetchedUsersDetails: UserDetails[];
  loggedInUserDetail: UserDetails;
  loggedInSuccessfull:boolean

  constructor(private authService: AuthService, private router: Router){ }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  onSubmit() {
    console.log("on Submit called.....");
    
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
        
      this.authObs = this.authService.logIn(email, password);
  
    this.authObs.subscribe(
      {
        next: (res) => {
          console.log("Success:", res);
          
          this.loggedInSuccessfull = true

          this.authService.fetchUserDetails().subscribe(data => {
            this.fetchedUsersDetails = data;
            const loggedInUser = this.fetchedUsersDetails?.filter(x=> x.email === this.loginForm.value.email);
            if (loggedInUser?.length > 0) {
              this.loggedInUserDetail = loggedInUser[0];

              // converting boolean to string
              localStorage.setItem('loggedInUserPermission', this.loggedInUserDetail.permission + '');
              localStorage.setItem('loggedUserName', this.loggedInUserDetail.name);
              localStorage.setItem('loggedUserEmail', this.loggedInUserDetail.email);

              if (this?.loggedInUserDetail?.permission === true) {
                // User is ADMIN
                localStorage.setItem('isAdminLogged', 'true');
                localStorage.setItem('isUserLogged', 'false');
                this.loginForm.reset();
                this.router.navigate(['/Permission'])
              } else {
                // Logged in User is USER.
                localStorage.setItem('isAdminLogged', 'false');
                localStorage.setItem('isUserLogged', 'true');
                this.router.navigate(['/DialogBox']); 
              }
            }
          })
        },
        error: (errMsg) => {
          console.log("Error:", errMsg);
          this.errorMessage = errMsg;
          alert(this.errorMessage);
        },
        complete: () => {
          console.log("Observable completed");
        }
      }
    );
  }
}

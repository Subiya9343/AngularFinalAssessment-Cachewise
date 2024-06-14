import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../Model/AuthResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;
  errorMessage: string | null = null; 
  authObs:Observable<AuthResponse>
  isAdminLogged = false

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
          if(email == 'admin@gmail.com' && password == 'aaaaaaaa'){
            this.authService.isAdminLogged = true
            this.authService.isUserLogged = false
            this.router.navigate(['/Configuration'])
            }else{
              this.authService.isAdminLogged = false
              this.authService.isUserLogged = true
              this.router.navigate(['/DialogBox']);
            }
        },
        error: (errMsg) => {
          console.log("Error:", errMsg);
          this.errorMessage = errMsg;
          this.hideSnackBar();
        },
        complete: () => {
          console.log("Observable completed");
        }
      }
    );
    this.loginForm.reset();
  }
  
  hideSnackBar(){
    setTimeout(() =>{
      this.errorMessage = null;
    }, 3000);
  }
}

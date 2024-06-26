import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../Model/AuthResponse';
import { Router } from '@angular/router';
import { UserDataService } from '../../Services/user-data.service';

@Component({
  selector: 'app-create-acc',
  templateUrl: './create-acc.component.html',
  styleUrl: './create-acc.component.css'
})
export class CreateAccComponent {

  createAccountForm: FormGroup;

  errorMessage: string | null = null; 
  authObs:Observable<AuthResponse>
  user;  //user details - sending data to database
  signUpUserDetails:any
  signUpAccountSucessfull: boolean;

  constructor(private authService: AuthService, private router: Router, 
    private dataService: UserDataService) { }

  ngOnInit(): void {
    this.createAccountForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, this.customEmailValidator]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', Validators.required),
      userType: new FormControl('user'),
      permission: new FormControl('false')
    }, { validators: this.matchPasswords });
  }

  

  // custom email validators
  customEmailValidator(control: AbstractControl) {
    const email = control.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (email && !emailPattern.test(email)) {
      return { invalidEmail: true };
    }
    return null;
  }

  // custom password validators
  matchPasswords(formGroup: FormGroup) {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword').setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      formGroup.get('confirmPassword').setErrors(null);  
        return null;
    }
  }
  onSubmit(){
    this.signUpUserDetails = {
      email: this.createAccountForm.value.email,
      password: this.createAccountForm.value.password
    }
    this.authObs = this.authService.signUp(this.signUpUserDetails.email, this.signUpUserDetails.password);

    this.authObs.subscribe(
        {
          next: (res) => {
            console.log("Success:", res);
            this.sendDataToDatabase()
            this.signUpAccountSucessfull = true;
            alert("SignUp Sucessfull")
            this.router.navigate(['/Login'])
          },
          error: (errMsg) => {
            this.errorMessage = errMsg;
            alert(this.errorMessage);
          },
          complete: () => {
            console.log("Observable completed");
          }
        }
      );
  }

  sendDataToDatabase(){
    this.user = {
        name : this.createAccountForm.value.name,
        email: this.createAccountForm.value.email,
        password: this.createAccountForm.value.password,
        userType: this.createAccountForm.value.userType,
        permission: this.createAccountForm.value.permission
      }
      this.dataService.addUserDetails(this.user);
      this.createAccountForm.reset();
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../../Model/AuthResponse';
import { UserDataService } from '../../Services/user-data.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showDialog;
  loggedIn
  errorMessage
  loggedUserDetail
  userData
  loggedUserName
  loggedUserEmail
  displayUserDialog:boolean
  

  constructor(private authService: AuthService, private router: Router, private userDataService:UserDataService){ }

  ngOnInit(){
    this.loggedUserName = localStorage.getItem('loggedUserName')
    this.loggedUserEmail = localStorage.getItem('loggedUserEmail')
  }

  logOut(){
    localStorage.clear();
    this.authService.logOut();
  }
  dialogBoxComponent(){
    this.authService.showDialog = true
    this.router.navigate(['/DialogBox'])
  }
  displayUserDetails(){
    this.displayUserDialog = true;
  }
}

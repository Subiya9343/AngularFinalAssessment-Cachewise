import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isAdminLogged
  isUserLogged

  constructor(private authService: AuthService){ }

  ngOnInit(){
    this.isAdminLogged = this.authService.isAdminLogged;
    this.isUserLogged = this.authService.isUserLogged;
  }

}

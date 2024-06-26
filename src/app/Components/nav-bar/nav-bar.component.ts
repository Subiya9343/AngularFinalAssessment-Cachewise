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

  ngOnInit(){
    const isAdminString = localStorage.getItem('isAdminLogged');
    if (isAdminString!== null) {
      this.isAdminLogged = JSON.parse(isAdminString);
    } else {
      this.isAdminLogged = false;
    }
    const isUserString = localStorage.getItem('isUserLogged');
    if (isUserString!== null) {
      this.isUserLogged = JSON.parse(isUserString);
    } else {
      this.isUserLogged = false;
    }
    
  }

}

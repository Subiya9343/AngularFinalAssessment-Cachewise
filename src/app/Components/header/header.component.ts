import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private authService: AuthService, private router: Router){ }

  logOut(){
    this.authService.logOut()
  }
  dialogBox(){
    this.router.navigate(['/DialogBox'])
  }
}

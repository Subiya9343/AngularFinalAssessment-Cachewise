import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthService } from "../Services/auth.service";

@Injectable({ providedIn: 'root'})
export class GuardService implements CanActivate{

    constructor(private authService: AuthService, private router: Router){ }

    canActivate(route: ActivatedRouteSnapshot):boolean {
        if(this.authService.IsAuthenticated()){
            if (route.routeConfig.path === 'Permission' && localStorage.getItem('loggedInUserPermission') === 'false') {
                alert("User cannot navigate to Permission Page")
                this.router.navigate(['Services']);
            }
            if (route.routeConfig.path === 'Configuration'&& localStorage.getItem('loggedInUserPermission') === 'false') {
                alert("User cannot navigate to Configuration Page")
                this.router.navigate(['Services']);
            } else {
                return true;
            }
        }else{
            this.router.navigate(['Login']);
        }
    }
}

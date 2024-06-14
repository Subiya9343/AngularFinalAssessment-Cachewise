import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../Services/auth.service";

@Injectable({ providedIn: 'root'})
export class GuardService implements CanActivate{

    constructor(private authService: AuthService, private route: Router){ }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
        if(this.authService.IsAuthenticated()){
            return true;
        }else{
            this.route.navigate(['Login']);
        }
    }

}
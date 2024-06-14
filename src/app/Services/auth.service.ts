import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthResponse } from "../Model/AuthResponse";
import { catchError, Subject, tap, throwError } from "rxjs";
import { User } from "../Model/User";

@Injectable({ providedIn: 'root'})
export class AuthService {
     
    user = new Subject<User>();
    private tokenExpire: any
    loggedIn:boolean = false;
    private _isAdminLogged: boolean = false;
    private _isUserLogged: boolean = false;
  
    get isAdminLogged(): boolean {
      return this._isAdminLogged;
    }
  
    set isAdminLogged(value: boolean) {
      this._isAdminLogged = value;
    }
  
    get isUserLogged(): boolean {
      return this._isUserLogged;
    }
  
    set isUserLogged(value: boolean) {
      this._isUserLogged = value;
    }

    constructor(private http: HttpClient, private route: Router){ }

    signUp(email, password){
        const data = {email: email, password: password, returnSecureToken: true}
         return this.http.post<AuthResponse>
         ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCSNMYxiv1c_3GYeoksksFxyRhuwBh5apg', data)
         .pipe(catchError(this.handleError), tap((res) =>{
            this.handleCreateUser(res)
         }))
    }

    logIn(email, password){
        this.loggedIn = true;
        const data = {email: email, password: password, returnSecureToken: true}
         return this.http.post<AuthResponse>
         ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCSNMYxiv1c_3GYeoksksFxyRhuwBh5apg', data)
         .pipe(catchError(this.handleError), tap((res) =>{
            this.handleCreateUser(res)
         }))
    }

    private handleCreateUser(res){
        const expiresInIs = new Date().getTime() + +res.expiresIn * 1000;
        const expiresIn = new Date(expiresInIs)
        const user = new User(res.email, res.localId, res.idToken, expiresIn)
        this.user.next(user)
        // this.autoLogout(res.expiresIn * 1000);

        localStorage.setItem('user', JSON.stringify(user));
    }

    private handleError(err){
        let errorMessage = 'An unknown error has occured'
            if(!err.error || !err.error.error){
                return throwError(() =>{ errorMessage})
            }
            switch(err.error.error.message){
                case 'EMAIL_EXISTS':
                   errorMessage = 'This email already exists'
                   break;
                case 'OPERATION_NOT_ALLOWED':
                    errorMessage = 'This operation is not allowed'
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'Email not found'
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'Invalid Password'
                    break;
                case 'INVALID_LOGIN_CREDENTIALS':
                    errorMessage = 'Email id or password is not correct'
                    break;
            }
            return throwError(() => errorMessage)
    }

    logOut(){
        this.loggedIn = false
        this.user.next(null);
        this.route.navigate(['/Login'])
        localStorage.removeItem('user')

        // if(this.tokenExpire){
        //     clearTimeout(this.tokenExpire)
        // }
        // this.tokenExpire = null;
    }

    autoLogin(){
        const user = JSON.parse(localStorage.getItem('user'));

        if(!user){
            return;
        }
        this.loggedIn = true;
        const loggedUser = new User(user.email, user.id, user._token, user._expiresIn)
        if(loggedUser.token){
            this.user.next(loggedUser)
            // const timerValue = user._expiresIn.getTime() - new Date().getTime()
            // this.autoLogout(timerValue)
        }
    }

    IsAuthenticated(){
        return this.loggedIn;
    }
    // autoLogout(expiresTime: number){
    //     this.tokenExpire = setTimeout(() =>{
    //     this.logOut()    
    //     }, expiresTime)
    // }
}
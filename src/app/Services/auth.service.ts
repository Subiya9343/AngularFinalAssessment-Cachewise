import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthResponse } from "../Model/AuthResponse";
import { BehaviorSubject, catchError, map, Subject, tap, throwError } from "rxjs";
import { User } from "../Model/User";
import { UserDetails } from "../Model/UserDetails";

@Injectable({ providedIn: 'root' })
export class AuthService {
    permission: boolean = false;
    user = new Subject<User>();
    loggedIn: boolean = false;
    private _isAdminLogged: boolean = false;
    private _isUserLogged: boolean = false;
    private _showDialog: boolean = true;

    constructor(private http: HttpClient, private route: Router) { }

    get isAdminLogged(): boolean {
        return this._isAdminLogged;
    }

    set isAdminLogged(value: boolean) {
        this._isAdminLogged = value;
        localStorage.setItem('isAdminLogged', JSON.stringify(value));
    }

    get isUserLogged(): boolean {
        return this._isUserLogged;
    }

    set isUserLogged(value: boolean) {
        this._isUserLogged = value;
        localStorage.setItem('isUserLogged', JSON.stringify(value));
    }
    get showDialog(): boolean {
        return this._showDialog;
    }

    set showDialog(value: boolean) {
        this._showDialog = value;
    }

    signUp(email, password) {
        const data = { email: email, password: password, returnSecureToken: true }
        return this.http.post<AuthResponse>
            ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCSNMYxiv1c_3GYeoksksFxyRhuwBh5apg', data)
            .pipe(catchError(this.handleError), tap((res) => {
                this.handleCreateUser(res)
            }))
    }

    logIn(email, password) {
        this.loggedIn = true;
        const data = { email: email, password: password, returnSecureToken: true }
        return this.http.post<AuthResponse>
            ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCSNMYxiv1c_3GYeoksksFxyRhuwBh5apg', data)
            .pipe(catchError(this.handleError), tap((res) => {
                this.handleCreateUser(res)
            }))
    }

    fetchUserDetails() {
        return this.http.get<{ [key: string]: UserDetails[] }>('https://angular-final-assessment-default-rtdb.firebaseio.com/user-data.json?print=pretty')
            .pipe(map((res) => {
                const userDetails = []
                for (const key in res) {
                    if (res.hasOwnProperty(key)) {
                        userDetails.push({ ...res[key], id: key })
                    }
                }
                return userDetails
            }))
    }

    private handleCreateUser(res) {
        const expiresInIs = new Date().getTime() + +res.expiresIn * 1000;
        const expiresIn = new Date(expiresInIs)
        const user = new User(res.email, res.localId, res.idToken, expiresIn)
        this.user.next(user)

        localStorage.setItem('user', JSON.stringify(user));
    }

    private handleError(err) {
        let errorMessage = 'An unknown error has occured'
        if (!err.error || !err.error.error) {
            return throwError(() => { errorMessage })
        }
        switch (err.error.error.message) {
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

    logOut() {
        this.loggedIn = false
        this.user.next(null);
        this.route.navigate(['/Login']);
    }

    IsAuthenticated() {
        return this.loggedIn;
    }


    autoLogin() {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            return;
        }
        this.loggedIn = true;
        const loggedUser = new User(user.email, user.id, user._token, user._expiresIn)
        if (loggedUser.token) {
            this.user.next(loggedUser)
        }
    }
}
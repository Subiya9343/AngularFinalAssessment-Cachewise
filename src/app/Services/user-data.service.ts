import { HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserDetails } from "../Model/UserDetails";
import { map } from "rxjs";

@Injectable({providedIn: "root"})
export class UserDataService{

    constructor(private http: HttpClient){ }

    addUserDetails(user: {name: string, email: string, password: string, userType : string, permission: boolean}){
    console.log(user);
    this.http.post('https://angular-final-assessment-default-rtdb.firebaseio.com/user-data.json',user)
    .subscribe((res) =>{
       console.log(res);
    });
    }

    fetchUserDetails(){
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

    deleteData(id: string){
        this.http.delete('https://angular-final-assessment-default-rtdb.firebaseio.com/user-data/'+ id+'.json')
    .subscribe({
        next: () => {
            console.log('Record deleted successfully:', id);
          },
          error: (error) => {
            console.error('Error deleting record:', error);
          }
      
    });
    }

    updateData(id:string, user:UserDetails){
        return this.http.patch('https://angular-final-assessment-default-rtdb.firebaseio.com/user-data/'+ id+'.json', user)
   }
}
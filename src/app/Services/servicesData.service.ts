import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

@Injectable({ providedIn: 'root'})
export class ServicesDataService {

    url:string="assets/servicesData.json";
    // \assets\servicesData.json

    constructor(private http: HttpClient){ }

    getAllServices() {
        let httpHeaders= new HttpHeaders({
            'Authorization': 'Bearer ' + 'eyJraWQiOiJDWGNQdmhHbXFja1doSWI2ckp6cnI4dlNPRjhUSlwvakRvdCtcLytIUUNFeVU9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjMWUzZWVkNS00MzU2LTRjOTMtYjE1Zi0wOTFmOGEzMGYyMjgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9nTWFTQjY3NmEiLCJjbGllbnRfaWQiOiI1OHBmaG12a3Vya2hqYmZhYmJvNnBhdG82ZiIsIm9yaWdpbl9qdGkiOiI2M2EzZGFmNC05YWMxLTRiZDEtOTNmYy1mYWQ4MmY0ZTk3ZGEiLCJldmVudF9pZCI6Ijc1NjRkMTQyLWM2ZDktNDU3NS05ODI1LWE3ZWJkMjg1YzcxYSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MTgzNjkxMDIsImV4cCI6MTcxODM3MDkwMiwiaWF0IjoxNzE4MzY5MTAyLCJqdGkiOiJiMDI0NmU2Ny1hZWIwLTQyNWYtODczMi03YjYyMzZhZjEwMmMiLCJ1c2VybmFtZSI6Ik1Sb3NzIn0.ko5Of0uYzGBeVyOgfsYuNy6miZPca1vuQvTkQbs3xsHu6xQ8uW8TDl_Jhcwlbs_gn2_8fLa8K4TGEn--eNXpGW-UsFccINhdlu-jD_0rq65EhhirDdzQoX8AN1hFtoFDt0mPrCfjGs9RAQZasx79tTXa85Fp-O10TJ-tq69wuZCjFe77N3FbnQD8adsvzxd8Xq8sP-IStjvlTYP-XR4T9LEzmJxF_0Pgo9HmrfftFSBhwumN5acNUmsSNG9KZtd3xfnOXxXh9lQDenfir6O81AWJG4zmR342mPZK2f0zT6TB54nvxLQ5J4OVqXKUJYv4S4a7AZt2hDh0le2sdjYJyQ'
        });
        return this.http.get('https://dev.ucboscloud.com/core-services/ucbos/cache/getCache?companyCode=UCB01&mapName=services', { headers: httpHeaders }).pipe(
          catchError(this.errorHandler)
        );
      }
    
      private errorHandler(error: HttpErrorResponse) {
        // Handle the error appropriately, such as logging it or displaying a user-friendly message
        console.error('An error occurred:', error.error.message || error.statusText);
        // Throw an application level error
        return throwError('Something bad happened; please try again later.');
      }
}





// import { HttpClient, HttpErrorResponse } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { catchError, throwError } from "rxjs";

// @Injectable({ providedIn: 'root'})
// export class ServicesDataService {

//     url:string="assets/servicesData.json";
//     // \assets\servicesData.json

//     constructor(private http: HttpClient){ }

//     getAllServices() {
//         return this.http.get(this.url).pipe(
//           catchError(this.errorHandler)
//         );
//       }
    
//       private errorHandler(error: HttpErrorResponse) {
//         // Handle the error appropriately, such as logging it or displaying a user-friendly message
//         console.error('An error occurred:', error.error.message || error.statusText);
//         // Throw an application level error
//         return throwError('Something bad happened; please try again later.');
//       }
// }
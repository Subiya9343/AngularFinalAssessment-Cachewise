import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

export interface ConfigData {
    companyNames: string[];
    environment: { name: string, url: string }[];
    services: { name: string, url: string }[];
  }
@Injectable({ providedIn: 'root'})
export class ConfigService {

    // configData: ConfigData[] = [];
    url = 'https://angular-final-assessment-default-rtdb.firebaseio.com/configuration-data.json';
    idDatabase;

    constructor(private http: HttpClient){ }

    sendData(configData){
        // console.log(configData);
        this.http.post(this.url,configData)
        .subscribe((res) =>{
           console.log(res);
        });
    }

    fetchConfigDetails(){
        return this.http.get<{ [key: string]: ConfigData }>('https://angular-final-assessment-default-rtdb.firebaseio.com/configuration-data.json?print=pretty')
            .pipe(map((res) => {
                const configDetails = []
                for (const key in res) {
                    if (res.hasOwnProperty(key)) {
                        configDetails.push({ ...res[key], id: key })
                    }
                }
                return configDetails
            }))
    }
    fetchData(endpoint: string): Observable<any> {
        return this.http.get<any>(`https://angular-final-assessment-default-rtdb.firebaseio.com/${endpoint}.json`);
    }

    updateData(id:string, data: ConfigData){
        // console.log(configData);
        let url = `https://angular-final-assessment-default-rtdb.firebaseio.com/configuration-data/${id}.json`;
        this.http.put(url , data)
        .subscribe((res) =>{
           console.log(res);
        });
    }
}


// updateData(id:string, data){
//     // console.log(configData);
//     let url = `https://angular-final-assessment-default-rtdb.firebaseio.com/configuration-data/${id}.json`;
//     this.http.put(url , data)
//     .subscribe((res) =>{
//        console.log(res);
//     });
// }
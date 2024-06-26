import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ServicesDataService {
  private url;
  private servToken: string | null;
  private httpHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    this.setHttpHeaders();
  }

  setHttpHeaders() {
    this.servToken = localStorage.getItem('serviceToken');
    if (this.servToken) {
      this.httpHeaders = new HttpHeaders({
        'Authorization': `Bearer ${this.servToken}`
      });
    }
  }

  getRequestParams(companyCode: string, serviceName: string, objectName: string, mapName: string): HttpParams {
    let params = new HttpParams();
    params = params.set('companyCode', companyCode);

    // Set mapName parameter
    if (mapName && mapName.trim() !== '') {
      params = params.set('mapName', mapName);
    } else {
      params = params.set('mapName', 'services');
    }

    // Set serviceName parameter
    if (serviceName && serviceName.trim() !== '') {
      params = params.set('serviceName', serviceName);
    }

    // Set objectName parameter
    if (objectName && objectName.trim() !== '') {
      params = params.set('objectName', objectName);
    }

    return params;
  }


  getAllServices(companyCode, serviceName, objectName, mapName) {
    this.url = localStorage.getItem('environment');
    const params = this.getRequestParams(companyCode, serviceName, objectName, mapName);
    return this.http.get(`${this.url}/core-services/ucbos/cache/getCache`, { headers: this.httpHeaders, params: params }).pipe(
      catchError(this.errorHandler)
    );
  }

  private errorHandler(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error.message || error.statusText);
    return throwError('Something bad happened; please try again later.');
  }

  clearData(companyCode, serviceName, objectName, mapName) {
    this.url = localStorage.getItem('environment');
    const params = this.getRequestParams(companyCode, serviceName, objectName, mapName);
    return this.http.post(`${this.url}/core-services/ucbos/cache/clear`, null, { headers: this.httpHeaders, params: params });
  }
}


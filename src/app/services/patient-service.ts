import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private http: HttpClient) {}
  patientSearch(query: string): Observable<any> {
    return this.http.get('http://localhost:3001/patient?patientName=' + query)
  }
}
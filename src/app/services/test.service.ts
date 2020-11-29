import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Test } from '../entities/test.entities';

@Injectable()
export class TestService {
  constructor(private http: HttpClient) {}

  getTests(): Observable<Test[]> {
    return this.http.get<Test[]>(environment.apiUrl + '/member/tests');
  }

  getTest(testId: string): Observable<Test> {
    return this.http.get<Test>(environment.apiUrl + '/member/test/' + testId);
  }
}

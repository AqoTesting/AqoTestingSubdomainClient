import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Attempt, AttemptResumeData, CommonTestAnswer } from '../entities/attempt.entities';
import { Test } from '../entities/test.entities';

@Injectable()
export class AttemptService {
  constructor(private http: HttpClient) {}

  getActiveAttempt(): Observable<Attempt> {
    return this.http.get<Attempt>(
      environment.apiUrl + '/member/attempt/active'
    );
  }

  getActiveAttemptResumeData(): Observable<AttemptResumeData> {
    return this.http.get<AttemptResumeData>(
      environment.apiUrl + '/member/attempt/active/resumeData'
    );
  }

  patchAnswer(
    answer: CommonTestAnswer,
    sectionId: string,
    questionId: string
  ): Observable<any> {
    return this.http.patch<any>(
      environment.apiUrl +
        '/member/attempt/active/section/' +
        sectionId +
        '/question/' +
        questionId +
        '/answer',
      answer
    );
  }

  endAttempt(): Observable<any> {
    return this.http.patch<any>(
      environment.apiUrl + '/member/attempt/active/finish',
      null
    );
  }

  getAttemptsByTestId(testId: string): Observable<Attempt[]> {
    return this.http.get<Attempt[]>(
      environment.apiUrl + '/member/test/' + testId + '/attempts'
    );
  }
}

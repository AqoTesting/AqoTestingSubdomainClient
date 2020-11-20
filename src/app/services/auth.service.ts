import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import {
  SignInMember,
  SignUpMember,
  Member,
  MemberToken,
} from '../entities/member.entities';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private _currentMember: Member;
  private _currentMember$: ReplaySubject<Member>;
  private _isAuthorized: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthorization();
  }

  public get currentMember(): Member {
    return this._currentMember;
  }

  public get currentMember$(): Observable<Member> {
    if (this._currentMember$ == null || this._currentMember$.hasError) {
      this._currentMember$ = new ReplaySubject<Member>();

      if (this._isAuthorized) {
        this.getMember()
          .pipe(take(1))
          .subscribe(
            (data: Member) => {
              this._currentMember = data;
              this._currentMember$.next(this._currentMember);
            },
            (error) => {
              this._currentMember = null;
              this._currentMember$.error(error);
            }
          );
      } else {
        this._currentMember = null;
        this._currentMember$.next(this._currentMember);
      }
    }

    return this._currentMember$;
  }

  public setAuthorized(authorized) {
    if (authorized) {
      if (!this._isAuthorized) {
        this._isAuthorized = true;
        this.currentMember$.subscribe();
      }
    } else {
      if (this._isAuthorized) {
        this._isAuthorized = false;
        this._currentMember$ = null;
      }
    }
  }

  private checkAuthorization() {
    this.setAuthorized(!!localStorage.getItem('token'));
  }

  public authorizeByToken(token: string) {
    localStorage.setItem('token', token);
    this.setAuthorized(true);
  }

  public unAuthorize() {
    localStorage.removeItem('token');
    this.setAuthorized(false);
  }

  public get isAuthorized() {
    this.checkAuthorization();
    return this._isAuthorized;
  }

  /* Methods */

  private getMember(): Observable<Member> {
    return this.http.get<Member>(environment.apiUrl + '/Member');
  }

  public getMemberTokenSignIn(
    signInMember: SignInMember
  ): Observable<MemberToken> {
    return this.http
      .post<MemberToken>(
        environment.apiUrl + '/member/signin',
        signInMember
      )
      .pipe(
        tap((data: MemberToken) => {
          this.authorizeByToken(data.token);
        })
      );
  }

  public getMemberTokenSignUp(
    signUpMember: SignUpMember
  ): Observable<MemberToken> {
    return this.http
      .post<MemberToken>(
        environment.apiUrl + '/member/signup',
        signUpMember
      )
      .pipe(
        tap((data: MemberToken) => {
          this.authorizeByToken(data.token);
        })
      );
  }
}

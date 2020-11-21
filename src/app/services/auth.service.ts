import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AsyncSubject,
  BehaviorSubject,
  Observable,
  ReplaySubject,
  throwError,
} from 'rxjs';
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
  public _currentMember$: ReplaySubject<Member>;
  private _isAuthorized: boolean = false;
  memberIsApproved$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthorization();
  }

  public get currentMember(): Member {
    return this._currentMember;
  }

  public get currentMember$(): Observable<Member> {
    if (this._currentMember$ == null || this._currentMember$.hasError) {
      this._currentMember$ = new ReplaySubject<Member>(1);
      if (this._isAuthorized) {
        this.getMember().pipe(take(1)).subscribe();
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

  public getMember(): Observable<Member> {
    return this.http.get<Member>(environment.apiUrl + '/member').pipe(
      tap(
        (member: Member) => {
          this._currentMember = member;
          this.memberIsApproved$.next(this._currentMember.isApproved);
          this._currentMember$.next(this._currentMember);
        },
        (error) => {
          this._currentMember = null;
          this._currentMember$.error(error);
        }
      )
    );
  }

  public getMemberTokenSignIn(
    signInMember: SignInMember
  ): Observable<MemberToken> {
    return this.http
      .post<MemberToken>(environment.apiUrl + '/member/signin', signInMember)
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
      .post<MemberToken>(environment.apiUrl + '/member/signup', signUpMember)
      .pipe(
        tap((data: MemberToken) => {
          this.authorizeByToken(data.token);
        })
      );
  }
}

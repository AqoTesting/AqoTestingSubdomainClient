import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';
import { RoomService } from '../services/room.service';
import { map } from 'rxjs/operators';

@Injectable()
export class MemberNotIsApproved implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.memberIsApproved$.pipe(
      map((isApproved) => {
        if (isApproved) this.router.navigate(['/']);
        return !isApproved;
      })
    );
  }
}

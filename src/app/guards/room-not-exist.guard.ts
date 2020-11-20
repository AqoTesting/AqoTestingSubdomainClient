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
export class RoomNotExistGuard implements CanActivate {
  constructor(private roomService: RoomService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.roomService.roomExis$.pipe(
      map((exists) => {
        console.log('RoomNotExistGuard', exists);
        if (exists) this.router.navigate(['/auth/signin']);
        return !exists;
      })
    );
  }
}

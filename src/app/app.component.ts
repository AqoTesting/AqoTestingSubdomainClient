import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from '../environments/environment';
import { Room } from './entities/room.entities';
import { Response } from './entities/response.entities';
import { RoomService } from './services/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { AuthService } from './services/auth.service';
import { Member } from './entities/member.entities';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  env: any = environment;
  room: Room;
  error: boolean = false;

  get member(): Member {
    return this.authService.currentMember;
  }

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.roomService.room$.subscribe(
      (room: Room) => {
        this.room = room;
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.roomService.setTitle(error.name);
        } else if (error instanceof Response) {
        }
        this.error = true;
        this.roomService.setTitle('Комната не существует');
        this.router.navigate(['404']);
      }
    );

    this.authService.currentMember$.subscribe(
      (member) => {
        if (member == null) this.error = true;
      },
      () => {
        this.error = true;
      }
    );
  }
}

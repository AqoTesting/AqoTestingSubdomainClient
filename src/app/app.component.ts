import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from '../environments/environment';
import { Room } from './entities/room.entities';
import { Response } from './entities/response.entities';
import { RoomService } from './services/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  env: any = environment;
  room: Room;
  notFound: boolean = false;

  constructor(
    private roomService: RoomService,
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
        this.notFound = true;
        this.roomService.setTitle("Комната не существует");
        this.router.navigate(['404']);
      }
    );
  }
}

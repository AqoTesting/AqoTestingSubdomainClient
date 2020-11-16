import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { environment } from '../environments/environment';
import { Room } from './entities/room.entities';
import { Response } from './entities/response.entities';
import { RoomService } from './services/room.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  env: any = environment;
  room: Room;

  constructor(private roomService: RoomService, private title: Title) {}

  ngOnInit() {
    this.roomService.room$.subscribe(
      (room) => {},
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.title.setTitle(`${error.name} | AqoTesting`);
        } else if (error instanceof Response) {
        }
      }
    );
  }
}

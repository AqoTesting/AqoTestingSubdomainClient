import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/entities/member.entities';
import { Room } from 'src/app/entities/room.entities';
import { AuthService } from 'src/app/services/auth.service';
import { RoomService } from 'src/app/services/room.service';
import { Background } from 'src/app/utils/background.utility';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  get room(): Room {
    return this.roomService.room;
  }

  constructor(
    private roomService: RoomService,
  ) {
    Background.setColor('#303030');
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}

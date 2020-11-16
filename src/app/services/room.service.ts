import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, ReplaySubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { Room } from '../entities/room.entities';

@Injectable()
export class RoomService {
  room$: ReplaySubject<Room> = new ReplaySubject<Room>();
  room: Room;
  roomId: string;
  roomDomain: string;

  constructor(private http: HttpClient, private titleService: Title) {
    this.roomId = this.getLocalRoomId();
    this.roomDomain = environment.subdomain;

    if (this.roomId) {
      setTimeout(() => {
        this.getRoomById(this.roomId).subscribe(
          (room: Room) => {
            this.room = room;
            this.room$.next(this.room);
            this.initializeTitle();
          },
          (error) => this.room$.error(error)
        );
      }, 1000);
    } else {
      setTimeout(() => {
        this.getRoomByDomain(this.roomDomain).subscribe(
          (room: Room) => {
            this.room = room;
            this.room$.next(this.room);
            this.initializeTitle();
          },
          (error) => this.room$.error(error)
        );
      }, 1000);
    }
  }

  private initializeTitle(): void {
    this.titleService.setTitle(`${this.room.name} | AqoTesting`);
  }

  private setLocalRoomId(roomId: string) {
    localStorage.setItem('roomId', roomId);
  }

  private getLocalRoomId(): string {
    return localStorage.getItem('roomId') || null;
  }

  getRoomById(roomId: string): Observable<Room> {
    return this.http.get<Room>(environment.apiUrl + '/member/room/' + roomId);
  }

  getRoomByDomain(roomDomain: string): Observable<Room> {
    return this.http.get<Room>(
      environment.apiUrl + '/member/room/domain/' + roomDomain
    );
  }
}

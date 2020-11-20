import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, ReplaySubject } from 'rxjs';
import { Response } from '../entities/response.entities';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Room } from '../entities/room.entities';

@Injectable()
export class RoomService {
  room$: ReplaySubject<Room> = new ReplaySubject<Room>();
  roomExis$: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  room: Room;
  roomId: string;
  roomDomain: string;

  constructor(private http: HttpClient, private titleService: Title) {
    this.roomId = this.getLocalRoomId();
    this.roomDomain = environment.subdomain;

    if (this.roomId) {
      this.getRoomById(this.roomId).subscribe(
        (room) => this.next(room),
        (error) => {
          if (
            error instanceof Response &&
            (error.errorMessageCode == 201 || error.errorMessageCode == 500)
          ) {
            this.getRoomByDomain(this.roomDomain).subscribe(
              (room) => this.next(room),
              (error) => this.error(error)
            );
          } else {
            this.error(error);
          }
        }
      );
    } else {
      this.getRoomByDomain(this.roomDomain).subscribe(
        (room) => this.next(room),
        (error) => this.error(error)
      );
    }
  }

  private next(room: Room) {
    if (room.domain == this.roomDomain) {
      this.room = room;
      this.room$.next(this.room);
      this.setLocalRoomId(this.room.id);
      this.setTitle(this.room.name);
      this.roomExis$.next(true);
    } else {
      this.removeLocalRoomId();
      this.getRoomByDomain(this.roomDomain).subscribe(
        (room) => this.next(room),
        (error) => this.error(error)
      );
    }
  }

  private error(error) {
    this.room$.error(error);
    this.roomExis$.next(false);
  }

  public setTitle(text: string): void {
    this.titleService.setTitle(`${text} | AqoTesting`);
  }

  private setLocalRoomId(roomId: string) {
    localStorage.setItem('roomId', roomId);
  }

  private removeLocalRoomId() {
    localStorage.removeItem('roomId');
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

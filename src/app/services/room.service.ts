import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, ReplaySubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { Room } from '../entities/room.entities';

@Injectable()
export class RoomService {
  room$: ReplaySubject<Room> = new ReplaySubject<Room>();;
  room: Room;
  roomId: string;
  roomDomain: string;

  constructor(private http: HttpClient, private titleService: Title) {
    this.roomId = this.getLocalRoomId();
    this.roomDomain = environment.subdomain;

    if (this.roomId) {
      setTimeout(() => {
        this.room = this.getRoomByDomain(this.roomDomain);
        this.room$.next(this.room);
        this.initializeTitle();
      }, 1000);
    } else {
      this.getRoomById(this.roomId).subscribe((data) => {
        this.room = data;
        this.room$.next(this.room);
        this.initializeTitle();
      });
    }
  }

  private initializeTitle(): void {
    this.titleService.setTitle(`${this.room.name} | AqoTesting`);
  }

  private setLocalRoomId(roomId: string) {
    localStorage.setItem('roomId', roomId);
  }

  private getLocalRoomId(): string {
    return localStorage.getItem('roomId');
  }

  getRoomById(roomId: string): Observable<Room> {
    return this.http.get<Room>(environment.apiUrl + '/user/room/' + roomId);
  }

  getRoomByDomain(roomDomain: string): Room {
    return new Room({
      id: '5fa7e2f9cc011ec92a5922d9',
      name: 'Операционные системы',
      domain: 'os',
      description: 'test',
      ownerId: '5f905db16b7181c62066ff24',
      fields: [
        {
          name: 'Группа',
          type: 2,
          isRequired: false,
          placeholder: null,
          mask: null,
          options: ['ПКС-019', 'ПКС-018'],
        },
        {
          name: 'ФИО',
          type: 1,
          isRequired: true,
          placeholder: 'BsonNull',
          mask: 'BsonNull',
          options: null,
        },
      ],
      isActive: false,
      isApproveManually: false,
      isRegistrationEnabled: false,
    });
  }
}

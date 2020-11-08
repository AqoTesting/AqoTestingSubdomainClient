import { Component } from '@angular/core';

import { environment } from '../environments/environment';
import { RoomService } from './services/room.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'AqoTestingSubdomainClient';
  env: any = environment;

  constructor(private roomService: RoomService) {}
}

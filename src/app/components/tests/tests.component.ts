import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/entities/member.entities';
import { Room } from 'src/app/entities/room.entities';
import { AuthService } from 'src/app/services/auth.service';
import { RoomService } from 'src/app/services/room.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
})
export class TestsComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  @Input() roomId: string;

  get room(): Room {
    return this.roomService.room;
  }
  tests: any[];

  constructor(
    private roomService: RoomService,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    this.getRoomTests();
  }

  getRoomTests(): void {
    this.subscription.add(
      this.testService.getTests().subscribe((data) => {
        this.tests = data;
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}

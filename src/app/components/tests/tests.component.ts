import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/entities/room.entities';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
})
export class TestsComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  @Input() roomId: string;

  tests: any[];

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.getRoomTests();
  }

  getRoomTests(): void {
    this.subscription.add(
      this.testService.getRoomTests(this.roomId).subscribe((data) => {
        //this.tests = data;
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}

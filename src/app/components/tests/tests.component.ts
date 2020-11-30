import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/entities/member.entities';
import { Room } from 'src/app/entities/room.entities';
import { Rank, Test } from 'src/app/entities/test.entities';
import { AuthService } from 'src/app/services/auth.service';
import { RoomService } from 'src/app/services/room.service';
import { TestService } from 'src/app/services/test.service';

import * as moment from 'moment';
import { AttemptService } from 'src/app/services/attempt.service';
import { AttemptResumeData } from 'src/app/entities/attempt.entities';
import { Router } from '@angular/router';

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
  get now(): moment.Moment {
    return moment();
  }
  tests: Test[];
  attemptResumeData: AttemptResumeData;

  constructor(
    private router: Router,
    private roomService: RoomService,
    private testService: TestService,
    private attemptService: AttemptService
  ) {
    moment.locale('ru');
  }

  ngOnInit(): void {
    this.getRoomTests();
    this.getActiveAttemptResumeData();
  }

  getRoomTests(): void {
    this.subscription.add(
      this.testService.getTests().subscribe((data: Test[]) => {
        this.tests = data.filter((test) => test.isActive);
      })
    );
  }

  getActiveAttemptResumeData() {
    this.subscription.add(
      this.attemptService
        .getActiveAttemptResumeData()
        .subscribe((attemptResumeData) => {
          this.attemptResumeData = attemptResumeData;
        })
    );
  }

  proceedAttempt() {
    this.router.navigate([
      '/attempt/active/section',
      this.attemptResumeData.currentSectionId,
      'question',
      this.attemptResumeData.currentQuestionId,
    ]);
  }

  testAvailable(test: Test): string {
    const activationDate = moment(test.activationDate);
    const deactivationDate = moment(test.deactivationDate);
    const now = this.now;

    if (test.activationDate && now < activationDate) {
      return activationDate.fromNow();
    } else if (test.deactivationDate && now > deactivationDate) {
      return deactivationDate.fromNow();
    } else {
      return 'сейчас';
    }
  }

  fromNow(date: string): string {
    return moment(date).fromNow();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}

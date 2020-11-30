import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Rank, Test } from 'src/app/entities/test.entities';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { TestService } from 'src/app/services/test.service';
import { SnackService } from 'src/app/services/snack.service';
import * as moment from 'moment';
import { Response } from 'src/app/entities/response.entities';
import { Attempt } from 'src/app/entities/attempt.entities';
import { AttemptService } from 'src/app/services/attempt.service';
import { AttemptComponent } from '../attempt/attempt.component';

@Component({
  selector: 'app-test-view',
  templateUrl: './test-view.component.html',
  styleUrls: ['./test-view.component.scss'],
})
export class TestViewComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  testId: string;

  activationDate: moment.Moment;
  deactivationDate: moment.Moment;

  test: Test;
  attempts: Attempt[];

  get now(): moment.Moment {
    return moment();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private testService: TestService,
    private attemptService: AttemptService,
    private snack: SnackService
  ) {
    moment.locale('ru');
    this.subscription.add(
      this.route.params.pipe(take(1)).subscribe((params) => {
        this.testId = params['testId'];
      })
    );
  }

  ngOnInit(): void {
    this.getTest();
    this.getAttempts();
  }

  getTest() {
    this.subscription.add(
      this.testService.getTest(this.testId).subscribe((test: Test) => {
        this.test = test;
        this.activationDate = moment(this.test.activationDate);
        this.deactivationDate = moment(this.test.deactivationDate);
      })
    );
  }

  getAttempts() {
    this.subscription.add(
      this.attemptService
        .getAttemptsByTestId(this.testId)
        .subscribe((attempts: Attempt[]) => {
          this.attempts = attempts.filter((attempt) => !attempt.ignore);
          console.log(attempts);
        })
    );
  }

  checkAttemptsIsActive(): boolean {
    return ~this.attempts.findIndex((attempt) => attempt.isActive)
      ? false
      : true;
  }

  testAvailable(): boolean {
    if (this.test?.attemptsNumber <= this.attempts.length)
      return false;

    const now = this.now;

    if (this.test.activationDate && now < this.activationDate) {
      return false;
    } else if (this.test.deactivationDate && now > this.deactivationDate) {
      return false;
    } else {
      return true;
    }
  }

  testAvailableMessage(): string {
    if (this.test?.attemptsNumber <= this.attempts.length)
      return 'У Вас не осталось попыток';

    const now = this.now;

    if (this.test.activationDate && now < this.activationDate) {
      return 'Тест запустится ' + this.activationDate.fromNow();
    } else if (this.test.deactivationDate && now > this.deactivationDate) {
      return 'Тест завершился ' + this.deactivationDate.fromNow();
    } else {
      return '';
    }
  }

  beginTest() {
    this.subscription.add(
      this.testService.beginTest(this.testId).subscribe(
        () => {
          this.router.navigate(['attempt', 'active']);
        },
        (error) => {
          if (error instanceof Response) {
            if (error.errorMessageCode == 512) {
              this.router.navigate(['attempt', 'active']);
            } else {
              this.snack.error(error.errorMessageCode);
            }
          }
        }
      )
    );
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}

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

  ranks: Rank[] = [
    { title: 'Не удовлетворительно', minimumScore: 0, color: 'ff0000' },
    { title: 'Удовлетворительно', minimumScore: 10, color: 'ffa500' },
    { title: 'Хорошо', minimumScore: 20, color: '69f0ae' },
    { title: 'Отлично', minimumScore: 30, color: '00ef7a' },
  ];
  get now(): moment.Moment {
    return moment();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private testService: TestService,
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
  }

  getTest() {
    this.subscription.add(
      this.testService.getTest(this.testId).subscribe((test: Test) => {
        this.test = test;
        this.activationDate = moment(this.test.activationDate);
        this.deactivationDate = moment(this.test.deactivationDate);
        console.log(test);
      })
    );
  }

  testAvailable(): boolean {
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
            this.snack.error(error.errorMessageCode);
          }
        }
      )
    );
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}

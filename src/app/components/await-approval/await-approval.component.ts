import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Member } from 'src/app/entities/member.entities';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-await-approval',
  templateUrl: './await-approval.component.html',
  styleUrls: ['./await-approval.component.scss'],
})
export class AwaitApprovalComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  intervalSubscription: Subscription;
  lock: boolean = false;
  second: number;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.intervalReload();
  }

  intervalReload() {
    const source = interval(1000);
    this.second = 15;
    this.intervalSubscription = source.subscribe(() => {
      if (this.second == 0) {
        this.intervalSubscription.unsubscribe();
      } else {
        this.second -= 1;
      }
    });
  }

  reload() {
    this.intervalSubscription.unsubscribe();
    this.second = -1;
    this.subscription.add(
      this.authService.getMember().subscribe(
        (member: Member) => {
          if (member.isApproved) {
            this.authService.memberIsApproved$.next(true);
            this.router.navigate(['/']);
          } else {
            this.intervalReload();
          }
        },
        () => {
          this.intervalReload();
        }
      )
    );
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.intervalSubscription) this.intervalSubscription.unsubscribe();
  }
}

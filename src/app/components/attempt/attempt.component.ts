import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-attempt',
  templateUrl: './attempt.component.html',
  styleUrls: ['./attempt.component.scss'],
})
export class AttemptComponent implements OnInit {
  public attemptId: string;
  public sectionId: number;
  public questionId: number;

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(({ attemptId, sectionId, questionId }) => {
      this.attemptId = attemptId;
      this.sectionId = +sectionId - 1;
      this.questionId = +questionId - 1;

      console.log(attemptId, sectionId, questionId);
    });
  }

  ngOnInit(): void {
    console.log(1);
  }

  getAttempt() {
    
  }
}

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  Section,
  Attempt,
  Question,
  CommonTestAnswer,
  QuestionTypes,
} from 'src/app/entities/attempt.entities';
import { Response } from 'src/app/entities/response.entities';
import { SnackService } from 'src/app/services/snack.service';
import { AttemptService } from '../../services/attempt.service';

@Component({
  selector: 'app-attempt',
  templateUrl: './attempt.component.html',
  styleUrls: ['./attempt.component.scss'],
})
export class AttemptComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  public lock: boolean = false;
  public sectionId: number;
  public questionId: number;
  public attempt: Attempt;
  public section: Section;
  public question: Question;
  public timer: { minute: string; second: string } = {
    minute: null,
    second: null,
  };

  private get now(): moment.Moment {
    return moment();
  }

  constructor(
    private route: ActivatedRoute,
    private attemptService: AttemptService,
    private snack: SnackService,
    private router: Router
  ) {
    route.params.subscribe(({ sectionId, questionId }) => {
      if (this.attempt) {
        this.toSectionAndQuestion(+sectionId, +questionId);
      } else {
        this.sectionId = +sectionId;
        this.questionId = +questionId;
      }
    });
  }

  ngOnInit(): void {
    this.getActiveAttempt();
  }

  startTimer() {
    const source = interval(1000);

    const end = moment(this.attempt.endDate);

    const tick = () => {
      const now = this.now;
      const diff = moment.duration(end.diff(now));
      const minute = diff.minutes();
      const second = diff.seconds();
      this.timer.minute = minute.toString();
      this.timer.second = String(second).padStart(2, '0');

      if (minute == 0 && second == 1) {
        this.timer.minute = '0';
        this.timer.second = '00';
        this.endAttempt(true);
      }
    };

    tick();
    this.subscription.add(source.subscribe(() => tick()));
  }

  getActiveAttempt() {
    this.subscription.add(
      this.attemptService.getActiveAttempt().subscribe(
        (attempt: Attempt) => {
          attempt.sections = Object.keys(attempt.sections)
            .map((key) => ({
              id: key,
              ...attempt.sections[key],
            }))
            .sort((a, b) => a.weight - b.weight);

          attempt.sections.forEach((section: Section) => {
            section.questions = Object.keys(section.questions)
              .map((key) => ({
                id: key,
                ...section.questions[key],
              }))
              .sort((a, b) => a.weight - b.weight);
          });

          attempt.sections.forEach((section) => {
            section.questions.forEach((question) => {
              if (question.type == 2) {
                question.leftMatching = [];
                question.rightMatching = [];
              }
              question.options.forEach((option, index) => {
                if (question.type == 2) {
                  question.leftMatching.push({
                    index,
                    text: option.leftText,
                    imageUrl: option.leftImageUrl,
                  });
                  question.rightMatching.push({
                    index,
                    text: option.rightText,
                    imageUrl: option.rightImageUrl,
                  });

                  delete option.leftText;
                  delete option.leftImageUrl;
                  delete option.rightText;
                  delete option.rightImageUrl;
                }
              });
            });
          });

          this.attempt = attempt;
          console.log(this.attempt);
          this.toSectionAndQuestion(this.sectionId, this.questionId);
          this.startTimer();
        },
        (error) => {
          this.router.navigate(['']);
          if (error instanceof Response) {
            this.snack.error(error.errorMessageCode);
          }
        }
      )
    );
  }

  toSectionAndQuestion(newSectionId: number, newQuestionId: number) {
    if (newSectionId < this.attempt.sections.length) {
      if (
        newQuestionId < this.attempt.sections[newSectionId]?.questions.length
      ) {
        this.sectionId = newSectionId;
        this.questionId = newQuestionId;
        this.section = this.attempt.sections[this.sectionId];
        this.question = this.section.questions[this.questionId];
        return;
      }
    }

    this.router.navigate(['/attempt', 'active', 'section', 0, 'question', 0]);
  }

  next() {
    this.patchAnswer(true);
  }

  before() {
    this.patchAnswer(false);
  }

  patchAnswer(next: boolean = true) {
    this.lock = true;
    this.subscription.add(
      this.attemptService
        .patchAnswer(this.getAnswer(), this.section.id, this.question.id)
        .subscribe(
          () => {
            if (this.question.type == QuestionTypes.Matching) {
              this.resetMatchingIndex();
            }
            if (next) {
              this.nextQuestion();
            } else {
              this.beforeQuestion();
            }
            this.lock = false;
          },
          (error) => {
            this.lock = false;
            if (error instanceof Response)
              this.snack.error(error.errorMessageCode);
          }
        )
    );
  }

  getAnswer(): CommonTestAnswer {
    let answer: CommonTestAnswer | any = new CommonTestAnswer();

    switch (this.question.type) {
      case QuestionTypes.SingleChoice:
        answer.selectedOption = this.question.options.findIndex(
          (option) => option.chosen
        );
        if (!~answer.selectedOption) answer = {};
        break;
      case QuestionTypes.MultipleChoice:
        answer.selectedOptions = [];
        this.question.options.forEach((option, index) => {
          if (option.chosen) answer.selectedOptions.push(index);
        });
        if (!answer.selectedOptions.length) answer = {};
        break;
      case QuestionTypes.Matching:
        answer.leftSequence = this.question.leftMatching.map(
          (option) => option.index
        );
        answer.rightSequence = this.question.rightMatching.map(
          (option) => option.index
        );
        break;
      case QuestionTypes.Sequence:
        break;
    }

    //answer.totalTimeAddition = 0;
    //answer.blurTimeAddition = 0;

    return answer;
  }

  resetMatchingIndex() {
    this.question.rightMatching.forEach(
      (option, index) => (option.index = index)
    );
  }

  nextQuestion() {
    let newQuestionId = this.questionId + 1;
    let newSectionId = this.sectionId + 1;
    if (newQuestionId < this.section.questions.length) {
      this.router.navigate([
        '/attempt',
        'active',
        'section',
        this.sectionId,
        'question',
        newQuestionId,
      ]);
    } else if (newSectionId < this.attempt.sections.length) {
      this.router.navigate([
        '/attempt',
        'active',
        'section',
        newSectionId,
        'question',
        0,
      ]);
    } else {
      this.router.navigate(['/attempt', 'active', 'section', 0, 'question', 0]);
    }
  }

  beforeQuestion() {
    let newQuestionId = this.questionId - 1;
    let newSectionId = this.sectionId - 1;

    if (newQuestionId < 0) {
      if (newSectionId < 0) {
        this.router.navigate([
          '/attempt',
          'active',
          'section',
          this.attempt.sections.length - 1,
          'question',
          this.attempt.sections[this.attempt.sections.length - 1].questions
            .length - 1,
        ]);
      } else {
        this.router.navigate([
          '/attempt',
          'active',
          'section',
          newSectionId,
          'question',
          this.attempt.sections[newSectionId].questions.length - 1,
        ]);
      }
    } else {
      this.router.navigate([
        '/attempt',
        'active',
        'section',
        newSectionId,
        'question',
        newQuestionId,
      ]);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.question.rightMatching,
      event.previousIndex,
      event.currentIndex
    );
  }

  changeRadio(i: number): void {
    this.question.options.forEach((option, index) => {
      if (index == i) option.chosen = true;
      else option.chosen = false;
    });
  }

  endAttempt(confirmIgnore = false) {
    if (confirmIgnore || confirm('Вы уверены, что хотите завершить тест?')) {
      this.lock = true;
      this.subscription.add(
        this.attemptService
          .patchAnswer(this.getAnswer(), this.section.id, this.question.id)
          .subscribe(
            () => {
              this.subscription.add(
                this.attemptService.endAttempt().subscribe(
                  () => {
                    this.router.navigate(['test', this.attempt.testId]);
                  },
                  (error) => {
                    this.lock = false;
                    if (error instanceof Response)
                      this.snack.error(error.errorMessageCode);
                  }
                )
              );
            },
            (error) => {
              this.lock = false;
              if (error instanceof Response)
                this.snack.error(error.errorMessageCode);
            }
          )
      );
    }
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}

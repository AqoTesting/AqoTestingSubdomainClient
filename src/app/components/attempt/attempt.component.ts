import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { fromEvent, interval, Subscription } from 'rxjs';
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
import {
  ListQuestions,
  ListQuestionsComponent,
} from './list-questions.component';

@Component({
  selector: 'app-attempt',
  templateUrl: './attempt.component.html',
  styleUrls: ['./attempt.component.scss'],
})
export class AttemptComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private focusObserver: Subscription;
  private blurObserver: Subscription;
  public lock: boolean = false;
  public sectionId: number;
  public questionId: number;
  public attempt: Attempt;
  public section: Section;
  public question: Question;
  private questionOpenTime: moment.Moment;
  private focusTime: moment.Moment;
  private blurTime: moment.Moment;
  private blurTimeAddition: number;
  public timer: { hours: string, minute: string; second: string } = {
    hours: null,
    minute: null,
    second: null,
  };

  public numberQuestions = 0;
  public currentQuestions = 0;

  private regarding = false;

  private get now(): moment.Moment {
    return moment();
  }

  constructor(
    private route: ActivatedRoute,
    private attemptService: AttemptService,
    private snack: SnackService,
    private router: Router,
    public dialog: MatDialog
  ) {
    route.queryParams.pipe(take(1)).subscribe(({ regarding }) => {
      if (regarding == 'true') this.regarding = true;
    });
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

  startBlurObserver() {
    if (this.blurObserver) this.blurObserver.unsubscribe();
    if (this.focusObserver) this.focusObserver.unsubscribe();

    this.questionOpenTime = moment();
    this.blurTime = moment();
    this.blurTimeAddition = 0;

    this.blurObserver = fromEvent(window, 'blur').subscribe(() => {
      this.blurTime = moment();
    });

    this.focusObserver = fromEvent(window, 'focus').subscribe(() => {
      this.focusTime = moment();
      this.blurTimeAddition += this.focusTime.diff(this.blurTime, 'second');
    });
  }

  startTimer() {
    const source = interval(1000);

    const end = moment(this.attempt.endDate);

    const tick = () => {
      const now = this.now;
      const diff = moment.duration(end.diff(now));
      const hours = diff.hours();
      const minute = diff.minutes();
      const second = diff.seconds();
      this.timer.hours = hours > 0 ? hours.toString() : null;
      this.timer.minute = String(minute).padStart(2, '0');
      this.timer.second = String(second).padStart(2, '0');

      if (now >= end) {
        this.endAttempt(true);
      }

      if (hours < 0 || minute < 0 || second < 0) {
        this.router.navigate(['test', this.attempt.testId]);
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
              .map((key) => {
                this.numberQuestions++;
                return {
                  id: key,
                  ...section.questions[key],
                };
              })
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

          if (
            this.regarding &&
            this.attempt.currentSectionId &&
            this.attempt.currentQuestionId
          ) {
            this.attempt.sections.forEach((section, index) => {
              if (section.id == this.attempt.currentSectionId)
                this.sectionId = index;
            });
            this.attempt.sections[this.sectionId].questions.forEach(
              (question, index) => {
                if (question.id == this.attempt.currentQuestionId)
                  this.questionId = index;
              }
            );
          }

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
        this.startBlurObserver();

        this.currentQuestions = 0;

        calc: for (let sectionIndex in this.attempt.sections) {
          if (+sectionIndex == this.sectionId) {
            for (let questionIndex in this.attempt.sections[sectionIndex]
              .questions) {
              this.currentQuestions++;
              if (+questionIndex == this.questionId) break calc;
            }
          } else
            this.currentQuestions += this.attempt.sections[
              sectionIndex
            ].questions.length;
        }

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
        else this.question.touched = true;
        break;
      case QuestionTypes.MultipleChoice:
        answer.selectedOptions = [];
        this.question.options.forEach((option, index) => {
          if (option.chosen) answer.selectedOptions.push(index);
        });
        if (!answer.selectedOptions.length) answer = {};
        else this.question.touched = true;
        break;
      case QuestionTypes.Matching:
        answer.leftSequence = this.question.leftMatching.map(
          (option) => option.index
        );
        answer.rightSequence = this.question.rightMatching.map(
          (option) => option.index
        );
        this.question.touched = true;
        break;
      case QuestionTypes.Sequence:
        break;
      case QuestionTypes.FillIn:
        answer.fills = [];
        this.question.options.forEach((option) => {
          if (option.isBlank) answer.fills.push(option.text);
        });
        this.question.touched = true;
        break;
    }

    answer.totalTimeAddition = moment().diff(this.questionOpenTime, 'second');
    answer.blurTimeAddition = this.blurTimeAddition;

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

  openListQuestions() {
    this.dialog.open(ListQuestionsComponent, {
      data: <ListQuestions>{
        sections: this.attempt.sections,
        sectionId: this.sectionId,
        questionId: this.questionId,
      },
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}

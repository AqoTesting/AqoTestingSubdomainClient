export class Attempt {
  id: string;
  memberId: string;
  userId: string;
  testId: string;
  sections: Section[] | any;
  currentSectionId: string;
  currentQuestionId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  ignore: boolean;

  maxPoints: number;

  correctPoints: number;
  penalPoints: number;

  penalRatio: number;
  correctRatio: number;
}

export class AttemptResumeData {
  testId: string;
  currentSectionId: string;
  currentQuestionId: string;
}

export class Section {
  id: string;
  title: string;
  questions: Question[] | any;
  weight: number;
}

export class Question {
  id: string;
  type: QuestionTypes;
  text: string;
  imageUrl: string;
  options: CommonOption[];
  cost: number;
  weight: number;
  totalTime: number;
  blurTime: number;

  leftMatching: Matching[];
  rightMatching: Matching[];
}

export class CommonOption {
  chosen: boolean;
  text: boolean;
  imageUrl: boolean;
  leftText: boolean;
  leftImageUrl: boolean;
  rightText: boolean;
  rightImageUrl: boolean;
}

export class CommonTestAnswer {
  selectedOption: number;
  selectedOptions: number[];
  sequence: number[];
  leftSequence: number[];
  rightSequence: number[];
  blurTimeAddition: number;
  totalTimeAddition: number;
}

export class Matching {
  index: number;
  text: string;
  imageUrl: string;
}

export enum QuestionTypes {
  SingleChoice = 0,
  MultipleChoice = 1,
  Matching = 2,
  Sequence = 3,
}

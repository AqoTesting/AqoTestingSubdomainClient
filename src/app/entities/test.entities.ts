export class Test {
  id?: string;
  roomId?: string;
  userId?: string;
  title: string;
  description: string;
  documents: Document[];
  isActive: boolean;
  showAllSections: boolean;
  attemptsNumber: number;
  attemptSectionsNumber: number;
  creationDate: string;
  activationDate: string;
  deactivationDate: string;
  shuffle: boolean = false;
  ranks: Rank[];
}

export class Document {
  title: string;
  link: string;
}

export class Rank {
  minimumScore: number;
  title: string;
  backgroundColor: string;
}
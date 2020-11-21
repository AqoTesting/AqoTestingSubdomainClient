interface Dictionary<T> {
  [key: string]: T;
}

export class Member {
  id: string;
  roomId: string;
  login: string;
  email: string;
  isApproved: boolean;
  fields: Dictionary<string>;
} 

export class MemberToken {
  token: string;
}

export class SignInMember {
  login: string;
  password: string;
  roomId: string;
}

export class SignUpMember {
  login: string;
  password: string;
  email: string;
  fields: Dictionary<string>;
  roomId: string;
}
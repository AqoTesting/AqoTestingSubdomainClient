export class Member {
  login: string;
  email: string;
  name: string;
}

export class MemberField {
  name: string;
  value: string;
}

export class MemberToken {
  token: string;
}

export class SignInMember {
  login: string;
  password: string;
}

export class SignUpMember {
  login: string;
  password: string;
  email: string;
  fields: MemberField[];
}
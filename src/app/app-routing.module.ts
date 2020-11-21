import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AwaitApprovalComponent } from './components/await-approval/await-approval.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RecoverComponentBack } from './components/recover/recover-back.component';
import { RecoverComponentFront } from './components/recover/recover-front.component';
import { RoomComponent } from './components/room/room.component';
import { SignInComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/signup/signup.component';
import { AuthorizedGuard } from './guards/authorized.guard';
import { MemberIsApproved } from './guards/member-is-approved.guard';
import { MemberNotIsApproved } from './guards/member-not-is-approved.guard';
import { NotAuthorizedGuard } from './guards/not-authorized.guard';
import { RoomExistGuard } from './guards/room-exist.guard';
import { RoomNotExistGuard } from './guards/room-not-exist.guard';

const routes: Routes = [
  {
    path: '404',
    component: NotFoundComponent,
    canActivate: [RoomNotExistGuard]
  },
  {
    path: 'await-approval',
    component: AwaitApprovalComponent,
    canActivate: [RoomExistGuard, MemberNotIsApproved]
  },
  { path: '', component: RoomComponent, canActivate: [RoomExistGuard, AuthorizedGuard, MemberIsApproved] },
  {
    path: 'auth',
    canActivate: [RoomExistGuard, NotAuthorizedGuard],
    children: [
      { path: '', redirectTo: 'auth/signin', pathMatch: 'full' },
      { path: 'signin', component: SignInComponent },
      { path: 'signup', component: SignUpComponent },
      { path: 'recover', component: RecoverComponentFront },
      { path: 'recover/:code', component: RecoverComponentBack },
      { path: '**', redirectTo: 'signin' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

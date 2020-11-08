import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecoverComponentBack } from './components/recover/recover-back.component';
import { RecoverComponentFront } from './components/recover/recover-front.component';
import { RoomComponent } from './components/room/room.component';
import { SignInComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/signup/signup.component';
import { AuthorizedGuard } from './guards/authorized.guard';
import { NotAuthorizedGuard } from './guards/not-authorized.guard';

const routes: Routes = [
  { path: '', component: RoomComponent, canActivate: [AuthorizedGuard] },
  {
    path: 'auth',
    canActivate: [NotAuthorizedGuard],
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './modules/material.module';
import { CatchErrorInterceptor } from './interceptors/catch-error.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthorizedGuard } from './guards/authorized.guard';
import { NotAuthorizedGuard } from './guards/not-authorized.guard';
import { ExitAboutGuard } from './guards/exit-about.guard';
import { AuthService } from './services/auth.service';
import { RoomService } from './services/room.service';
import { SnackService } from './services/snack.service';
import { TestService } from './services/test.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SignInComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/signup/signup.component';
import { RecoverComponentFront } from './components/recover/recover-front.component';
import { RecoverComponentBack } from './components/recover/recover-back.component';
import { RoomComponent } from './components/room/room.component';
import { SnackComponent } from './components/snack/snack.component';
import { TestsComponent } from './components/tests/tests.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RoomNotExistGuard } from './guards/room-not-exist.guard';
import { RoomExistGuard } from './guards/room-exist.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SignInComponent,
    SignUpComponent,
    RecoverComponentFront,
    RecoverComponentBack,
    RoomComponent,
    SnackComponent,
    TestsComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    RoomService,
    SnackService,
    TestService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CatchErrorInterceptor,
      multi: true,
    },

    AuthorizedGuard,
    NotAuthorizedGuard,
    ExitAboutGuard,
    RoomExistGuard,
    RoomNotExistGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

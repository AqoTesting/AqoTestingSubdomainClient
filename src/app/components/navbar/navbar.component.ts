import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Member, MemberToken } from 'src/app/entities/member.entities';
import { AuthService } from 'src/app/services/auth.service';
import { Background } from 'src/app/utils/background.utility';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  
  public get member(): Member {
    return this._authService.currentMember;
  }

  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit(): void {
  }

  signOut(): void {
    this._authService.unAuthorize();
    this._router.navigate(['auth/signin']);
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef<ProfileComponent>
  ) {}

  ngOnInit(): void {}

  logoutSystem(): void {
    this.authenticationService.logout().subscribe(() => {
      this.router.navigate(['/login'], { replaceUrl: true });
    });
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

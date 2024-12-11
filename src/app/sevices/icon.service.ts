import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

enum Icons {
  Small_logo = 'small-logo',
  Big_logo = 'big-logo',
  Map = 'map',
  Meeting = 'meeting',
  Employees = 'employees',
  Reports = 'reports',
  Settings = 'settings',
  Notification = 'notification',
  Back = 'back',
  Close = 'close',
  Edit = 'edit',
  Logout = 'logout',
  Red_close = 'red-close',
  Left_arrow = 'left-arrow',
  Right_arrow = 'right-arrow',
  Search = 'search',
  Down_arrow = 'down-arrow',
  Download = 'download',
  Red_edit = 'red-edit',
}

enum Images {}

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  public registerIcons(): void {
    this.loadIcons(Object.values(Icons), '../../assets/icon');
    this.loadIcons(Object.values(Images), '../../assets/images');
  }

  private loadIcons(iconKeys: string[], iconUrl: string): void {
    iconKeys.forEach((key) => {
      // this.matIconRegistry.addSvgIcon(key, this.domSanitizer.bypassSecurityTrustResourceUrl(`${iconUrl}/${key}.svg`));

      this.matIconRegistry.addSvgIcon(
        key,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`${location.origin}/assets/icon/${key}.svg`)
      );
    });
  }
}

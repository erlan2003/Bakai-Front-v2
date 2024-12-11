import { Component, Input, OnInit } from '@angular/core';

export type FontIcon = 'outlined' | 'round' | 'sharp' | 'two-tone';

@Component({
  selector: 'app-icon',
  templateUrl: './app-icon.component.html',
  styleUrls: ['./app-icon.component.scss'],
})
export class AppIconComponent implements OnInit {
  @Input() icon!: string;
  @Input() svgIcon!: string;
  @Input() font!: FontIcon;
  @Input() size: number = 24;
  @Input() width?: number;
  @Input() height?: number;

  type = 'material';

  ngOnInit(): void {
    this.type = this.icon?.startsWith('icon-') ? 'app' : 'material';
  }
}

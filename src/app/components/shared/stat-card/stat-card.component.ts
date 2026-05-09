import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {
  @Input() title!: string;
  @Input() value!: string;
  @Input() subtitle?: string;
  @Input() icon: string = 'chart';
  @Input() variant: 'accent' | 'success' | 'warning' | 'pink' = 'accent';
}

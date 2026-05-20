import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  format?: 'currency' | 'date' | 'datetime' | 'time' | 'text';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() emptyMessage = 'No hay registros para mostrar';

  formatValue(value: any, format?: string): string {

    if (value == null) return '—';

    const date = this.parseDate(value);

    switch (format) {

      case 'currency':
        return `$ ${Number(value).toLocaleString('es-AR')}`;

      case 'date':
        return date.toLocaleDateString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

      case 'time':
        return date.toLocaleTimeString('es-AR', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

      case 'datetime':
        return date.toLocaleString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

      default:
        return String(value);
    }
  }

  parseDate(value: any): Date {

  // Firebase Timestamp
  if (value?.seconds) {
    return new Date(value.seconds * 1000);
  }

  return new Date(value);
}
}

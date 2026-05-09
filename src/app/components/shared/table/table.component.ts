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

    switch (format) {
      case 'currency':
        return `$ ${Number(value).toLocaleString('es-AR')}`;
      case 'date':
        return new Date(value).toLocaleDateString('es-AR', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
      case 'time':
        return new Date(value).toLocaleTimeString('es-AR', {
          hour: '2-digit', minute: '2-digit'
        });
      case 'datetime':
        return new Date(value).toLocaleDateString('es-AR', {
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });
      default:
        return String(value);
    }
  }
}

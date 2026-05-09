import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, PaymentMethod, ServiceType } from '../../../models';
import { ServiceFilters } from '../../../services/service-record.service';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css'
})
export class FilterBarComponent implements OnInit {
  @Input() employees: Employee[] = [];
  @Output() filtersChange = new EventEmitter<ServiceFilters>();

  dateFrom: string = '';
  dateTo: string = '';
  selectedEmployee: string = '';
  selectedPayment: string = '';

  paymentMethods = Object.values(PaymentMethod);
  isExpanded = false;

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.dateFrom = today;
    this.dateTo = today;
    this.emitFilters();
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  onFilterChange(): void {
    this.emitFilters();
  }

  clearFilters(): void {
    const today = new Date().toISOString().split('T')[0];
    this.dateFrom = today;
    this.dateTo = today;
    this.selectedEmployee = '';
    this.selectedPayment = '';
    this.emitFilters();
  }

  get hasActiveFilters(): boolean {
    return !!this.selectedEmployee || !!this.selectedPayment;
  }

  private emitFilters(): void {
    const filters: ServiceFilters = {};

    if (this.dateFrom) {
      filters.dateFrom = new Date(this.dateFrom + 'T00:00:00');
    }
    if (this.dateTo) {
      filters.dateTo = new Date(this.dateTo + 'T23:59:59');
    }
    if (this.selectedEmployee) {
      filters.employeeId = this.selectedEmployee;
    }
    if (this.selectedPayment) {
      filters.paymentMethod = this.selectedPayment as PaymentMethod;
    }

    this.filtersChange.emit(filters);
  }
}

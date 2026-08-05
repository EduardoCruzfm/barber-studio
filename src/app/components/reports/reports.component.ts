import { Component } from '@angular/core';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { CardComponent } from '../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { RecordItem } from '../../models/record-item.model';
import { ServiceRecordService, MonthlyReport, EmployeeSettlement} from '../../services/service-record.service';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule,StatCardComponent,CardComponent, ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  records: RecordItem[] = [];
  report?: MonthlyReport;
  dailySettlement?: EmployeeSettlement[] = [];
  monthlySettlement?: EmployeeSettlement[] = [];
  selectedEmployee?: EmployeeSettlement;

  constructor(private db: DatabaseService, private serviceRecord: ServiceRecordService){
    this.serviceRecord
    .getCurrentMonthReport().subscribe((report: any) => {
        this.report = report;
        console.log('reportes',report)
    });

    this.serviceRecord.getEmployeesDailySettlement().subscribe(records => {
      this.dailySettlement = records;
       console.log('dailySettlement',records)
    });
    // this.serviceRecord.getEmployeesMonthlySettlement(50).subscribe(records => {
    //   this.monthlySettlement = records;
    //   console.log('monthlySettlement',records)
    // });
  }


  selectEmployee(employee: any) {

  this.serviceRecord
    .getEmployeesDailySettlement()
    .subscribe(settlements => {

      this.selectedEmployee = settlements.find(
        s => s.employeeId === employee.employeeId
      );
      console.log('test',this.selectedEmployee)
    });

}
  monthlyIncome(){
    //    comision y total a cobrar
  }

}

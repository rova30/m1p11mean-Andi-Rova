import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeLayoutRoutes } from './employee-layout.routing';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { TaskComponent } from '../../employee/task/task.component';
import { EmployeeService } from '../../api/employee.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EmployeeLayoutRoutes),
    FormsModule,
    ChartsModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    TaskComponent,
  ],providers: [
    EmployeeService
  ]
})

export class EmployeeLayoutModule {}

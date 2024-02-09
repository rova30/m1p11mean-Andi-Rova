import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../manager/dashboard/dashboard.component';
import { UserProfileComponent } from '../../manager/user-profile/user-profile.component';
import { TableListComponent } from '../../manager/table-list/table-list.component';
import { TypographyComponent } from '../../manager/typography/typography.component';
import { IconsComponent } from '../../manager/icons/icons.component';
import { MapsComponent } from '../../manager/maps/maps.component';
import { NotificationsComponent } from '../../manager/notifications/notifications.component';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { UpgradeComponent } from '../../manager/upgrade/upgrade.component';
import { EmployeeComponent } from '../../manager/employee/employee.component';
import { CustomerComponent } from '../../manager/customer/customer.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ChartsModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    EmployeeComponent,
    CustomerComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
  ]
})

export class AdminLayoutModule {}

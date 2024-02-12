import { Routes } from '@angular/router';

import { DashboardComponent } from '../../manager/dashboard/dashboard.component';
import { UserProfileComponent } from '../../manager/user-profile/user-profile.component';
import { TableListComponent } from '../../manager/table-list/table-list.component';
import { TypographyComponent } from '../../manager/typography/typography.component';
import { IconsComponent } from '../../manager/icons/icons.component';
import { MapsComponent } from '../../manager/maps/maps.component';
import { NotificationsComponent } from '../../manager/notifications/notifications.component';
import { UpgradeComponent } from '../../manager/upgrade/upgrade.component';
import { EmployeeComponent } from '../../manager/employee/employee.component';
import { ServiceComponent } from '../../manager/service/service.component';
import { CustomerComponent } from '../../manager/customer/customer.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'manager/dashboard',      component: DashboardComponent },
    { path: 'manager/user-profile',   component: UserProfileComponent },
    { path: 'manager/table-list',     component: TableListComponent },
    { path: 'manager/service',     component: ServiceComponent },
    { path: 'manager/customer',     component: CustomerComponent },
    { path: 'manager/employee',     component: EmployeeComponent },
    { path: 'manager/typography',     component: TypographyComponent },
    { path: 'manager/icons',          component: IconsComponent },
    { path: 'manager/maps',           component: MapsComponent },
    { path: 'manager/notifications',  component: NotificationsComponent },
    { path: 'manager/upgrade',        component: UpgradeComponent }
];

import { Routes } from '@angular/router';
import { TaskComponent } from '../../employee/task/task.component';


export const EmployeeLayoutRoutes: Routes = [
    { path: 'employee/profile', component: TaskComponent },
    { path: 'employee/appointment', component: TaskComponent },
    { path: 'employee/task', component: TaskComponent }
];

import { Routes } from '@angular/router';
import { TaskComponent } from '../../employee/task/task.component';
import { AppointmentComponent } from '../../employee/appointment/appointment.component';
import { ProfileComponent } from '../../employee/profile/profile.component';


export const EmployeeLayoutRoutes: Routes = [
    { path: 'employee/profile', component: ProfileComponent },
    { path: 'employee/appointment', component: AppointmentComponent },
    { path: 'employee/task', component: TaskComponent }
];

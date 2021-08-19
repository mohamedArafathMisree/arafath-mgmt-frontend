 
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
import { StudentComponent, userListComponent } from './pages';
 
const routes: Routes = [
    {   path: 'student', component: StudentComponent,
        children :[ 
            { path: 'list', component: userListComponent},
        ]
    },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
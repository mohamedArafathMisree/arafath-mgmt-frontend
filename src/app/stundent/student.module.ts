import { NgModule } from '@angular/core';
import { StudentRoutingModule } from './student.routing.module';
import { StudentComponent , userListComponent  } from './pages';
 
@NgModule({
  declarations: [StudentComponent,userListComponent],
  imports: [
    StudentRoutingModule,
  ],
  providers: [],
})
export class StudnetModule { }
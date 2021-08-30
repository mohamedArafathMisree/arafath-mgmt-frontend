import { NgModule } from '@angular/core';
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { StudentRoutingModule } from './student.routing.module';
import { StudentComponent, userListComponent } from './pages';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { EditService } from '../core/services/edit.service';
import { UploadsModule } from "@progress/kendo-angular-upload";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { DataService } from "../core/services/data.service";
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [StudentComponent, userListComponent],
  imports: [
    StudentRoutingModule,
    FormsModule,
    GridModule,
    HttpClientModule,
    HttpClientJsonpModule,
    UploadsModule,
    DateInputsModule,
    ReactiveFormsModule
  ],
  providers: [
    DataService,
    {
      deps: [HttpClient],
      provide: EditService,
      useFactory: (jsonp: HttpClient) => () => new EditService(jsonp)
    }
  ],
})
export class StudnetModule { }
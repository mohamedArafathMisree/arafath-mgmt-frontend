import { NgModule } from '@angular/core';
import { HttpClient, HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StudentRoutingModule } from './student.routing.module';
import { StudentComponent, userListComponent } from './pages';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { UploadsModule } from "@progress/kendo-angular-upload";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { DataService } from "../core/services/data.service";
import { ReactiveFormsModule } from '@angular/forms';
import { SocketService } from '../core/services/socket.service';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [StudentComponent, userListComponent],
  imports: [
    StudentRoutingModule,
    FormsModule,
    CommonModule,
    GridModule,
    HttpClientModule,
    UploadsModule,
    DateInputsModule,
    ReactiveFormsModule
  ],
  providers: [
    DataService,
    SocketService,
  ],
})
export class StudnetModule { }
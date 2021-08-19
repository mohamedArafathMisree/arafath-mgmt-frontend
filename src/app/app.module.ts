import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GridModule } from '@progress/kendo-angular-grid';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudnetModule } from './stundent/student.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditService } from './core/services/edit.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    StudnetModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    GridModule
  ],
  providers: [
    {
      deps: [HttpClient],
      provide: EditService,
      useFactory: (jsonp: HttpClient) => () => new EditService(jsonp)
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

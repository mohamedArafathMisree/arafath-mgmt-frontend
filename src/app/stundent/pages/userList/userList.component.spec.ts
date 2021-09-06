// import { HttpClient } from '@angular/common/http';
import { Component, DebugElement } from '@angular/core';
import { waitForAsync, ComponentFixture, fakeAsync, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { userListComponent } from '..';
import { DataService } from 'src/app/core/services/data.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { UploadsModule } from "@progress/kendo-angular-upload";
import { HttpClientModule } from '@angular/common/http';
import { Apollo, gql } from "apollo-angular";


import { NotificationService } from "@progress/kendo-angular-notification";
import { SocketService } from 'src/app/core/services/socket.service';
import { Student } from 'src/app/core/models/Student';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { DELETE_STUDENT, GET_ALL_STUDENTS, UPDATE_STUDENT } from "../../../core/const/queries";


let birthday = new Date('07/07/1991')


const TEST_ALL_STUDENTS =
{
  "data": {
    "getAllStudents": [
      {
        id: "76d005ee-1993-4b59-ab1a-7a910962c2a7",
        name: "Nimal T",
        dob: birthday,
        email: "abc@432",
        age: 29
      },
      {
        id: "7ff46b30-15e0-4975-a975-042f8e68b7a9",
        name: "Kamal T",
        dob: birthday,
        email: "fds@345",
        age: 30
      },
    ]
  }
}

const TEST_DELETE = {
  "data": {
    "removeStudent": {
      "id": "1b90d1b0-f3d2-4b4a-bf39-523883929175"
    }
  }
}
const TEST_UPDATE = {
  "data": {
    "updateStudent": {
      "id": "1b90d1b0-f3d2-4b4a-bf39-523883929175",
      "name": "Nimal T",
      "dob": birthday,
      "email": "abc@432",
      "age": 29
    }
  }
}

const STUDENTS: Student[] = [
  {
    id: "76d005ee-1993-4b59-ab1a-7a910962c2a7",
    name: "Nimal T",
    dob: birthday,
    email: "abc@432",
    age: 29
  },
  {
    id: "7ff46b30-15e0-4975-a975-042f8e68b7a9",
    name: "Kamal T",
    dob: birthday,
    email: "fds@345",
    age: 30
  },
];

const ONE_STUDENT: Student =
{
  id: "1b90d1b0-f3d2-4b4a-bf39-523883929175",
  name: "Nimal T",
  dob: birthday,
  email: "abc@432",
  age: 29
}


describe('userListComponent', () => {



  let component: userListComponent;
  let fixture: ComponentFixture<userListComponent>;
  let de: DebugElement

  let dataServiceMock: any
  let dataService: DataService

  let socketService: SocketService;
  let notificationSrvice: jasmine.SpyObj<NotificationService>;
  let backend: ApolloTestingController;

  let apolloService: Apollo


  beforeEach(waitForAsync(() => {
    const notificationSpy = jasmine.createSpyObj('notificationSrvice', ['getValue']);

    TestBed.configureTestingModule({
      declarations: [userListComponent],
      imports: [
        HttpClientModule,
        FormsModule,
        GridModule,
        UploadsModule,
        ApolloTestingModule,

      ],

      providers: [
        Apollo,
        DataService,
        // { provide: Apollo, useValue: apolloSpy },
        SocketService,
        { provide: NotificationService, useValue: notificationSpy },
      ]
      ,
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(userListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    socketService = TestBed.inject(SocketService);
    notificationSrvice = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    dataService = TestBed.inject(DataService);
    apolloService = TestBed.inject(Apollo);

    backend = TestBed.inject(ApolloTestingController);



    fixture.detectChanges();

  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get birthday and return age", () => {
    let birthday = new Date('09/05/2000')

    let age = component.calculateAge(birthday);

    expect(age).toEqual(21)

  });
  it("should call getAllStudents", () => {

    component.refresh();

    expect(component.getAllStudents).toHaveBeenCalled

  });

  it("should get all students", (done) => {
    dataService.getAllStudents().subscribe((result: any) => {
      let _result: any = result.data.getAllStudents
      expect(_result).toEqual(STUDENTS);
      done();
    });

    backend.expectOne(GET_ALL_STUDENTS).flush(TEST_ALL_STUDENTS);
  });
  it("should remove a student and return id", (done) => {
    dataService.deleteStudent(ONE_STUDENT).subscribe((result: any) => {
      let _result: any = result.data.removeStudent
      expect(_result.id).toEqual(ONE_STUDENT.id);
      done();
    });

    backend.expectOne(DELETE_STUDENT).flush(TEST_DELETE);
  });
  it("should edit and return student", (done) => {
    dataService.updateStudent(ONE_STUDENT).subscribe((result: any) => {
      let _result: any = result.data.updateStudent
      expect(_result.id).toEqual(ONE_STUDENT.id);
      done();
    });

    backend.expectOne(UPDATE_STUDENT).flush(TEST_UPDATE);
  });

  it("should call save handler", () => {
    let dataItem = {
      id: "1b90d1b0-f3d2-4b4a-bf39-523883929175",
      name: "Nimal T",
      dob: birthday,
      email: "abc@432",
      age: 29
    }

    component.saveHandler({ dataItem });


    expect(component.saveHandler).toHaveBeenCalled

  });
  it("should call remove handler", () => {
    let dataItem = {
      id: "1b90d1b0-f3d2-4b4a-bf39-523883929175",
      name: "Nimal T",
      dob: birthday,
      email: "abc@432",
      age: 29
    }

    component.saveHandler({ dataItem });


    expect(component.removeHandler).toHaveBeenCalled
    expect(component.getAllStudents).toHaveBeenCalled

  });

});

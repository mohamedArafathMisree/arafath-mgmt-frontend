import { OnInit } from "@angular/core";
import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { HttpClient } from "@angular/common/http";
import { Student } from "../models/Student";
import { shareReplay } from 'rxjs/operators';
import { DELETE_STUDENT, GET_ALL_STUDENTS, UPDATE_STUDENT } from "../const/queries";



@Injectable()
export class DataService implements OnInit {

  public students: Student[] = []



  constructor(private apolloService: Apollo, private http: HttpClient) { }

  ngOnInit() {
  }

  getAllStudents() {
    return this.apolloService
      .watchQuery({
        query: GET_ALL_STUDENTS
      })
      .valueChanges.pipe(shareReplay(1));
  }

  deleteStudent(payLoad: Student) {
    let studentId = payLoad.id;
    return this.apolloService
      .mutate({
        mutation: DELETE_STUDENT,
        variables: {
          id: studentId,
        },
      }).pipe(shareReplay(1));
  }

  updateStudent(payLoad: Student) {
    let studentData = payLoad;
    return this.apolloService
      .mutate({
        mutation: UPDATE_STUDENT,
        variables: {
          student: studentData,
        },
      }).pipe(shareReplay(1));
  }
}

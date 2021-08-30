import { Component, OnInit } from "@angular/core";
import { observable, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { HttpClient } from "@angular/common/http";
import { Student } from '../models/Student'



@Injectable()
export class DataService implements OnInit {
  // updateStudent(myForm: import("@angular/forms").FormGroup | undefined) {
  //     throw new Error('Method not implemented.');
  // }
  public students = new Observable();

  constructor(private apollo: Apollo, private http: HttpClient,) { }

  ngOnInit() {
    console.log("data");
  }

  getAllStudents() {
    return this.apollo
      .watchQuery({
        query: gql`
          {
            getAllStudents {
              id
              name
              dob
              email
              age
            }
          }
        `,
      })
  }





  deleteStudent(payLoad: Student) {

    let _data
    console.log('');

    let studentId = payLoad.id


    const DELETE_STUDENT = gql`
  mutation removeStudent($id: String!) {
    removeStudent(id: $id) {
      id
    }
  }
`;

    this.apollo.mutate({
      mutation: DELETE_STUDENT,
      variables: {
        id: studentId
      }
    }).subscribe(({ data }) => {
      this.getAllStudents()
      console.log('got data', data);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  updateStudent(payLoad: Student) {

    let studentData = payLoad
    console.log('ll');


    const UPDATE_STUDENT = gql`
  mutation updateStudent($student: UpdateStudentInput!) {
    updateStudent(studentInput: $student) {
      id
    }
  }
`;

    this.apollo.mutate({
      mutation: UPDATE_STUDENT,
      variables: {
        student: studentData
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });

  }

  uploadFiles(formData: any) {
    this.http
      .post<any>(`http://localhost:6000/api/upload`, formData).subscribe(response => {
        console.log(response);

      }, error => {
        console.log(error);
      });
  }

}

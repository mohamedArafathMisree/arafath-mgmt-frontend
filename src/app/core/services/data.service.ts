import { Component, OnInit } from "@angular/core";
import { observable, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { HttpClient } from "@angular/common/http";
import { Student } from "../models/Student";

@Injectable()
export class DataService implements OnInit {

  public students = new Observable();

  constructor(private apollo: Apollo, private http: HttpClient) { }

  ngOnInit() {
    console.log("data");
  }

  getAllStudents() {
    return this.apollo.watchQuery({
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
    });
  }
  deleteStudent(payLoad: Student) {
    let _data;
    console.log("");

    let studentId = payLoad.id;

    const DELETE_STUDENT = gql`
      mutation removeStudent($id: String!) {
        removeStudent(id: $id) {
          id
        }
      }
    `;

    this.apollo
      .mutate({
        mutation: DELETE_STUDENT,
        variables: {
          id: studentId,
        },
      })
      .subscribe(
        ({ data }) => {
          return data
          this.getAllStudents();
          console.log("got data", data);
        },
        (error) => {
          console.log("there was an error sending the query", error);
        }
      );
  }

  updateStudent(payLoad: Student) {
    let studentData = payLoad;
    console.log("ll");

    const UPDATE_STUDENT = gql`
      mutation updateStudent($student: UpdateStudentInput!) {
        updateStudent(studentInput: $student) {
          id
        }
      }
    `;

    this.apollo
      .mutate({
        mutation: UPDATE_STUDENT,
        variables: {
          student: studentData,
        },
      })
      .subscribe(
        ({ data }) => {
          console.log("got data", data);
          return data
        },
        (error) => {
          console.log("there was an error sending the query", error);
        }
      );
  }

  uploadSelected(file: any) {
    var formdata = new FormData();
    formdata.append("file", file, "Data.xlsx");

    this.http
      .post("http://localhost:7000/api/upload", formdata)
      .subscribe((response) => {
        console.log("response received is ", response);
      });
  }
}

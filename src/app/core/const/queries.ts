import { Apollo, gql } from "apollo-angular";

export const DELETE_STUDENT = gql`
mutation removeStudent($id: String!) {
  removeStudent(id: $id) {
    id
  }
}
`;
export const GET_ALL_STUDENTS = gql`
{
  getAllStudents {
    id
    name
    dob
    email
    age
  }
}
`;

export const UPDATE_STUDENT = gql`
mutation updateStudent($student: UpdateStudentInput!) {
  updateStudent(studentInput: $student) {
    id
  }
}
`;
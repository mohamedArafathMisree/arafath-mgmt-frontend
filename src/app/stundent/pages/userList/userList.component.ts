import { Observable, Subscription } from "rxjs";
import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { DataItem, GridDataResult } from "@progress/kendo-angular-grid";
import { State, process } from "@progress/kendo-data-query";

import { Student } from "../../../core/models/Student";
import { map } from "rxjs/operators";
import { FileRestrictions } from "@progress/kendo-angular-upload";
import { DataService } from "../../../core/services/data.service";
import { UploadEvent } from "@progress/kendo-angular-upload";
import * as moment from "moment";
import { FormatSettings } from "@progress/kendo-angular-dateinputs";
import { SocketService } from "src/app/core/services/socket.service";
import { environment } from "src/environments/environment.dev";


@Component({
    selector: "my-app",
    templateUrl: "./userList.component.html",
    styleUrls: ["./userList.component.scss"],
})
export class userListComponent implements OnInit {
    private query: any;

    public opened = false;
    public dialogResult = false;


    public uploadSaveUrl = environment.uploadSaveUrl

    public myForm: FormGroup | undefined;
    fileInputLabel: string | undefined;

    public students: Student[] = [];

    public value: Date = new Date(2000, 2, 10);
    public view!: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10,
    };
    private editedRowIndex: number | undefined;
    private editedProduct: Student | undefined;

    myRestrictions: FileRestrictions = {
        allowedExtensions: [".xls", ".xlsx"],
    };
    uploadedFiles: any;
    studentData!: Observable<GridDataResult>;

    public format: FormatSettings = {
        displayFormat: "dd/MM/yyyy",
        inputFormat: "dd/MM/yy",
    };
    removeDataItem: any;

    constructor(
        // @Inject(EditService) editServiceFactory: any,
        private dataService: DataService,
        // public http: HttpClient,
        private socketService: SocketService,
    ) {
    }

    public ngOnInit() {
        this.getAllStudents()
        this.socketService.success.subscribe(msg => {
            console.log(msg);

            if (msg == "-successful-") {
                this.getAllStudents()
            }
        });

        console.log(this.students);
        console.log(this.studentData);

    }

    public getAllStudents() {
        this.students = []
        this.dataService.getAllStudents().subscribe((result: any) => {
            result.data.getAllStudents.map((_student: any) => {
                let date = moment(_student.dob).utc().format("MM/DD/YYYY");

                var __date = date.split('/');
                let _date = new Date(parseInt(__date[2]), parseInt(__date[1]), parseInt(__date[0]), 22)


                let __std: Student = {
                    id: _student.id,
                    name: _student.name,
                    dob: _date,
                    age: _student.age,
                    email: _student.email,
                };
                this.students.push(__std);
            });
            // this.studentData = this.students.map((data: any) => process(data, this.gridState));

            console.log(this.studentData, this.students);


        });
    }
    public onStateChange(state: State) {
    }

    public async uploadEventHandler(e: UploadEvent) {

        let _data: any

        var formdata = new FormData();
        let _file: any = e.files[0].rawFile
        formdata.append("file", _file, "Data.xlsx");
        e.data = formdata

        console.log(_data);

    }
    public addHandler({ sender }: any, formInstance: any) {
        formInstance.reset();
        this.closeEditor(sender);
        this.myForm = new FormGroup({
            name: new FormControl(),
            dob: new FormControl(),
            age: new FormControl(),
            email: new FormControl(),
        });
        sender.addRow(this.myForm);

        // sender.addRow(new Product());
    }

    public editHandler({ sender, rowIndex, dataItem }: any) {
        console.log(this.calculateAge(dataItem.dob));

        this.myForm = new FormGroup({
            userName: new FormControl(dataItem.userName),
            dob: new FormControl(dataItem.dob),
            age: new FormControl(dataItem.age),
            email: new FormControl(dataItem.email),
        });
        console.log("myForm", this.myForm);

        this.closeEditor(sender);

        this.editedRowIndex = rowIndex;
        this.editedProduct = Object.assign({}, dataItem);

        sender.editRow(rowIndex, this.myForm);
    }

    public cancelHandler({ sender, rowIndex }: any) {
        this.closeEditor(sender, rowIndex);
    }

    public saveHandler({ sender, rowIndex, dataItem, isNew }: any) {
        let data = { ...dataItem, age: Number(dataItem.age) };
        this.dataService.updateStudent(data).subscribe(data => {
            console.log(data);

        })

        sender.closeRow(rowIndex);

        this.editedRowIndex = undefined;
        this.editedProduct = undefined;
        setTimeout(() => { this.getAllStudents() }, 2000);

    }

    public async removeHandler({ dataItem }: any) {
        this.opened = true;

        this.removeDataItem = dataItem
        // let _result;
        // this.dataService.deleteStudent(dataItem).subscribe(data => {
        //     console.log(data);

        // })
        // console.log(_result);

        // setTimeout(() => { this.getAllStudents() }, 2000);

    }

    private closeEditor(grid: any, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
    }
    calculateAge(birthday: any) { // birthday is a date
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    public onChange(value: Date, dataItem: any): void {
        this.students.map(data => {
            if (data.id == dataItem.id) {
                data.age = this.calculateAge(value)
            }
        })

    }

    public refresh() {
        this.getAllStudents();
    }

    public close(status: any) {
        console.log(`Dialog result: ${status}`);
        if (status == 'yes') {

            let _result;
            this.dataService.deleteStudent(this.removeDataItem).subscribe(data => {
                console.log(data);

            })
            console.log(_result);

            setTimeout(() => { this.getAllStudents() }, 2000);
            this.dialogResult = true
        } else {
            this.dialogResult = false
        }
        this.opened = false;
    }


}
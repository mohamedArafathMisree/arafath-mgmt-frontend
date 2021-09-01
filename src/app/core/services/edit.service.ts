import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Student } from "../../core/models/Student";
import * as moment from "moment"; 0

import { Apollo, gql } from 'apollo-angular';

import { tap, map } from "rxjs/operators";
import { DataService } from "./data.service";

const CREATE_ACTION = "create";
const UPDATE_ACTION = "update";
const REMOVE_ACTION = "destroy";

@Injectable()
export class EditService extends BehaviorSubject<any[]> {
    query: any;
    students: any;
    constructor(private http: HttpClient, private dataService: DataService) {
        super([]);
    }
    private dataURL = "./data";

    private data: any[] = [];

    public read() {
        if (this.data.length) {
            return super.next(this.data);
        }

        // this.fetch()
        //     .pipe(
        //         tap(data => {
        //             this.data = data;
        //         })
        //     )
        //     .subscribe(data => {
        //         super.next(data);
        //     });
    }

    public save(data: any, isNew?: boolean) {
        const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

        this.reset();

        this.fetch(action, data).subscribe(
            () => this.read(),
            () => this.read()
        );
    }

    public remove(data: any) {
        this.reset();

        this.fetch(REMOVE_ACTION, data).subscribe(
            () => this.read(),
            () => this.read()
        );
    }

    public resetItem(dataItem: any) {
        if (!dataItem) {
            return;
        }

        // find orignal data item
        const originalDataItem = this.data.find(
            (item) => item.email === dataItem.email
        );

        // revert changes
        Object.assign(originalDataItem, dataItem);

        super.next(this.data);
    }

    private reset() {
        this.data = [];
    }

    private fetch(action: string = "", data?: any): Observable<any[]> {
        return this.http
            .jsonp(
                `https://demos.telerik.com/kendo-ui/service/Products/${action}?${this.serializeModels(
                    data
                )}`,
                "callback"
            )
            .pipe(map((res) => <any[]>res));
    }

    private serializeModels(data?: any): string {
        console.log(this.data);

        return data ? `&models=${JSON.stringify([data])}` : "";
    }

    uploadFiles(formData: any) {
        this.http.post<any>(`http://localhost:6000/api/upload`, formData).subscribe(
            (response) => {
                console.log(response);
            },
            (error) => {
                console.log(error);
            }
        );
    }

}

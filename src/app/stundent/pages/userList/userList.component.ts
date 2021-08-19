import { Observable } from 'rxjs';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Product } from '../../../core/models/product';
import { map } from 'rxjs/operators';
import { EditService } from '../../../core/services/edit.service';


@Component({
  selector: 'my-app',
  template: `./userList.component.html`,
})
export class userListComponent implements OnInit {
    public view: Observable<GridDataResult> | undefined;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };

    private editService: EditService;
    private editedRowIndex: number | undefined;
    private editedProduct: Product | undefined;

    constructor(@Inject(EditService) editServiceFactory: any) {
        this.editService = editServiceFactory();
    }

    public ngOnInit(): void {
        this.view = this.editService.pipe(map(data => process(data, this.gridState)));

        this.editService.read();
    }

    public onStateChange(state: State) {
        this.gridState = state;

        this.editService.read();
    }

    public addHandler({sender} : any, formInstance : any) {
        formInstance.reset();
        this.closeEditor(sender);

        sender.addRow(new Product());
    }

    public editHandler({sender, rowIndex, dataItem} : any) {
        this.closeEditor(sender);

        this.editedRowIndex = rowIndex;
        this.editedProduct = Object.assign({}, dataItem);

        sender.editRow(rowIndex);
    }

    public cancelHandler({sender, rowIndex} :any) {
        this.closeEditor(sender, rowIndex);
    }

    public saveHandler({sender, rowIndex, dataItem, isNew} :  any) {
        this.editService.save(dataItem, isNew);

        sender.closeRow(rowIndex);

        this.editedRowIndex = undefined;
        this.editedProduct = undefined;
    }

    public removeHandler({dataItem} : any) {
        this.editService.remove(dataItem);
    }

    private closeEditor(grid : any, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editService.resetItem(this.editedProduct);
        this.editedRowIndex = undefined;
        this.editedProduct = undefined;
    }
}

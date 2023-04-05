import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSort } from '@angular/material/sort';

import { Store } from '../models/store';
import { Patient } from '../models/patient';
import { StoreService } from '../services/store.service';
import { SnackService, SNACK_TYPE } from '../services/snack.service';
@Component({
    selector: 'app-visit',
    templateUrl: './visit.component.html',
    styleUrls: ['./visit.component.css'],
})
export class VisitComponent implements OnInit {
    constructor(
        private storeService: StoreService,
        private snacService: SnackService,
    ) {}
    @ViewChild(MatSort) sort: MatSort;
    patient!: Patient;
    store!: Store[];
    ngAfterViewInit(): void {
        this.store = this.store.sort((a, b) => a.id - b.id);
    }
    ngOnInit(): void {
        this.patient = history.state;
        this.storeService.getStore().subscribe({
            next: (data) => (this.store = data),
            error: (err) => {
                this.snacService.showSnackBarMessage(
                    'ERROR.PATIENT_VISIT_CREATE_PATIENT',
                    SNACK_TYPE.error,
                );
                console.log(err.message);
            },
        });
    }
    selectPatient(patientSelected: Patient) {
        this.patient = patientSelected;
    }
    displayedColumns: string[] = [
        'id',
        'negativepoint',
        'positivepoint',
        'name',
        'image',
    ];
}

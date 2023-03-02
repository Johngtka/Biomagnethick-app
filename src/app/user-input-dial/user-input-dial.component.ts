import { Component } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
// import { Validators } from '@angular/forms';
import { PatientService } from '../services/patient-service';
import { Patient } from './../models/patient';
import { SnackService } from '../services/snack.service';
@Component({
    selector: 'app-user-input-dial',
    templateUrl: './user-input-dial.component.html',
    styleUrls: ['./user-input-dial.component.css'],
})
export class UserInputDialComponent {
    complete = true;
    constructor(
        private patientService: PatientService,
        private Snackbar: SnackService,
    ) {}
    registerForm = new FormGroup({
        name: new FormControl(),
        surname: new FormControl(),
        dob: new FormControl(),
        gender: new FormControl(),
        email: new FormControl(),
        phone: new FormControl(),
        location: new FormControl(),
    });
    patientData!: Patient[];
    addPatient() {
        const patient = this.registerForm.value;
        console.log('patient form value:', patient);
    }
}

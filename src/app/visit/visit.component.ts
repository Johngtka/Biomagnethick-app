// import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

// import { DatePipe } from '@angular/common';
// import { MatDialog } from '@angular/material/dialog';
// import { MatPaginator } from '@angular/material/paginator';
// import {
//     MatTableDataSource,
//     MatTableDataSourcePaginator,
// } from '@angular/material/table';

// import { Store } from '../models/store';
// import { Visit } from '../models/visit';
// import { Patient } from '../models/patient';
// import { Company } from '../models/company';
// import { StoreService } from '../services/store.service';
// import { SnackService, SNACK_TYPE } from '../services/snack.service';
// import { NavigationObject } from '../models/NavigationObject';
// import { VisitService } from '../services/visit.service';
// import { CompanyService } from '../services/company.service';
// import {
//     ConfirmationDialogResponse,
//     ConfirmationDialogComponent,
// } from '../confirmation-dialog/confirmation-dialog.component';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// @Component({
//     selector: 'app-visit',
//     templateUrl: './visit.component.html',
//     styleUrls: ['./visit.component.css'],
// })
// export class VisitComponent implements OnInit {
//     constructor(
//         private storeService: StoreService,
//         private snackService: SnackService,
//         private visitService: VisitService,
//         private companyService: CompanyService,
//         private datePipe: DatePipe,
//         private dialog: MatDialog,
//     ) {}

//     @ViewChild(MatPaginator) paginator: MatPaginator;
//     patient: Patient;
//     dataSource: MatTableDataSource<Store, MatTableDataSourcePaginator>;
//     visitPoints: number[] = [];
//     store: Store[];
//     noteVal: string;
//     showCheck = false;
//     showFinish = false;
//     date = new Date();
//     isLoadingResults = true;
//     company: Company;
//     displayedColumns: string[] = [
//         'id',
//         'negativePoint',
//         'positivePoint',
//         'name',
//         'type',
//         'image',
//     ];

//     ngOnInit(): void {
//         this.patient = {} as Patient;
//         const urlPatient = history.state;
//         if (this.checkIfPatient(urlPatient)) {
//             this.patient = urlPatient;
//         }
//         this.storeService.getStore().subscribe({
//             next: (data) => {
//                 this.store = data.sort((a, b) => a.id - b.id);
//                 this.dataSource = new MatTableDataSource<Store>(this.store);
//                 this.dataSource.paginator = this.paginator;
//                 this.isLoadingResults = false;
//             },
//             error: (err) => {
//                 this.snackService.showSnackBarMessage(
//                     'ERROR.PATIENT_VISIT_CREATE_PATIENT',
//                     SNACK_TYPE.error,
//                 );
//                 console.log(err.message);
//             },
//         });
//         this.companyService.getCompany().subscribe({
//             next: (data) => {
//                 this.company = data;
//             },
//             error: (err) => {
//                 console.log(err);
//             },
//         });
//     }

//     selectPatient(patientSelected: Patient): void {
//         this.patient = patientSelected;
//     }

//     clickedRow(row): void {
//         const index = this.visitPoints.indexOf(row.id);
//         if (index !== -1) {
//             this.visitPoints.splice(index, 1);
//             this.showCheck = false;
//         } else {
//             this.visitPoints.push(row.id);
//         }
//         this.paginatorPageChecker();
//     }

//     toggleTableVisibility(): void {
//         if (this.visitPoints.length >= 1) {
//             const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
//                 data: {
//                     title: 'CONFIRMATION_DIALOG.CLOSE_VISIT_TITLE',
//                     message: 'PATIENT_VISIT.INFO.LOST',
//                 },
//                 disableClose: true,
//             });
//             dialogRef.afterClosed().subscribe((conf) => {
//                 if (conf === ConfirmationDialogResponse.OK) {
//                     this.patient = {} as Patient;
//                     this.showCheck = false;
//                     this.showFinish = false;
//                     this.dataSource = new MatTableDataSource<Store>(this.store);
//                     this.dataSource.paginator = this.paginator;
//                     this.visitPoints = [];
//                     console.clear();
//                 }
//             });
//         } else {
//             this.patient = {} as Patient;
//             this.visitPoints = [];
//         }
//     }

//     @HostListener('document:keydown', ['$event'])
//     handleKeyboardEvent(event: KeyboardEvent): void {
//         if (event.key === 'ArrowRight' && this.paginator.hasNextPage()) {
//             this.paginator.nextPage();
//             this.paginatorPageChecker();
//         } else if (
//             event.key === 'ArrowLeft' &&
//             this.paginator.hasPreviousPage()
//         ) {
//             this.paginator.previousPage();
//             this.paginatorPageChecker();
//         }
//     }

//     createVisitPointsTable(): void {
//         this.dataSource = new MatTableDataSource<Store>(
//             this.store.filter((s: Store) => this.visitPoints.includes(s.id)),
//         );
//         this.paginator.firstPage();
//         this.showFinish = true;
//         this.showCheck = false;
//         this.dataSource.paginator = this.paginator;
//     }

//     pageTriggerManually(): void {
//         this.paginatorPageChecker();
//     }

//     sendVisit(): void {
//         const visit: Visit = {
//             patientId: this.patient._id,
//             note: this.noteVal,
//             points: this.visitPoints,
//         };
//         const pdfData = {
//             fullName: this.patient.name + ' ' + this.patient.surname,
//             logo: this.company.logo,
//             genericInfo: this.company.genericInfo,
//         };
//         const docDefinition = {
//             content: [
//                 {
//                     text: this.datePipe.transform(Date.now(), 'dd.MM.yyyy'),
//                     margin: [0, 10],
//                 },
//                 {
//                     layout: 'noBorders',
//                     table: {
//                         widths: ['50%', '50%'],
//                         body: [
//                             [
//                                 {
//                                     text: pdfData.fullName,
//                                     alignment: 'left',
//                                 },
//                                 {
//                                     image: pdfData.logo,
//                                     width: 100,
//                                     alignment: 'right',
//                                 },
//                             ],
//                         ],
//                     },
//                 },
//                 {
//                     text: pdfData.genericInfo,
//                     margin: [0, 100],
//                 },
//                 {
//                     table: {
//                         widths: ['50%', '50%'],
//                         body: this.visitPoints.map((point) =>
//                             this.getPdfRow(point),
//                         ),
//                     },
//                 },
//             ],
//         };
//         this.visitService.createVisit(visit).subscribe({
//             next: (data) => {
//                 this.snackService.showSnackBarMessage(
//                     'SUCCESS.PATIENT_VISIT_CREATE_VISIT',
//                     SNACK_TYPE.success,
//                 );
//                 pdfMake.createPdf(docDefinition).open();
//                 console.log(data);
//             },
//             error: (error) => {
//                 this.snackService.showSnackBarMessage(
//                     'ERROR.PATIENT_VISIT_CREATE_VISIT',
//                     SNACK_TYPE.error,
//                 );
//                 console.log(error);
//             },
//         });
//     }

//     private getPdfRow(point: number) {
//         return [
//             {
//                 text: point,
//             },
//             {
//                 image: this.store.find((s: Store) => s.id === point).image,
//                 width: 100,
//                 alignment: 'center',
//             },
//         ];
//     }

//     private paginatorPageChecker() {
//         if (!this.paginator.hasNextPage() && this.visitPoints.length >= 1) {
//             this.showCheck = true;
//         } else {
//             this.showCheck = false;
//         }
//     }

//     private checkIfPatient(
//         object: Patient | NavigationObject,
//     ): object is Patient {
//         return Object.hasOwn(object, 'name');
//     }
// }
import { Component } from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

@Component({
    selector: 'app-visit',
    styleUrls: ['./visit.component.css'],
    templateUrl: './visit.component.html',
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
            ),
        ]),
    ],
})
export class VisitComponent {
    dataSource = ELEMENT_DATA;
    columnsToDisplay = ['name', 'symbol'];
    expandedElement: PeriodicElement | null;
    expandedRowColumns = ['expandedDetail'];
}

export interface PeriodicElement {
    name: string;
    symbol: string;
    description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        name: 'Hydrogen',
        symbol: 'H',
        description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
    },
    {
        name: 'Helium',
        symbol: 'He',
        description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`,
    },
    {
        name: 'Lithium',
        symbol: 'Li',
        description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`,
    },
    {
        name: 'Beryllium',
        symbol: 'Be',
        description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`,
    },
    {
        name: 'Boron',
        symbol: 'B',
        description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`,
    },
];

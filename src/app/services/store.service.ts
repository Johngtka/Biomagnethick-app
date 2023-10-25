import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

import { Store } from '../models/store';
import { environment } from '../../environments/environment';
import { SNACK_TYPE, SnackService } from './snack.service';

@Injectable({
    providedIn: 'root',
})
export class StoreService implements OnDestroy {
    constructor(private http: HttpClient, private snackService: SnackService) {}

    apiURL = environment.API_URL;
    store = new BehaviorSubject<Array<Store>>([]);
    tempStore = [];
    ngOnDestroy() {
        this.store.complete();
    }
    setStore(data: Store[]) {
        this.store.next(data);
    }

    getStore() {
        return this.store.asObservable();
    }

    fetchStore() {
        this.getStoreFromServer().subscribe({
            next: (data) => {
                this.setStore(data);
            },
            error: (err) => {
                this.snackService.showSnackBarMessage(
                    'ERROR.GENERIC',
                    SNACK_TYPE.error,
                );
                console.log(err.message);
            },
        });
    }

    getStoreFromServer(): Observable<Array<Store>> {
        return this.http.get<Array<Store>>(this.apiURL + '/store');
    }
}

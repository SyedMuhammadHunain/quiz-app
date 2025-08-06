import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    loading = signal(false);

    setLoading(loading: boolean) {
        this.loading.set(loading);
    }
}
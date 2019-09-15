import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private http: HttpClient) {
    }

    register(userDetails: any) {
        return this.http.post(`${environment.serverURL}/v1/register`, userDetails);
    }

    checkUsernameAvailable(username: string) {
        return timer(400)
            .pipe(
                switchMap(() => {
                    return this.http.get(`${environment.serverURL}/v1/checkUsernameExists?username=${username}`)
                })
            );
    }
}
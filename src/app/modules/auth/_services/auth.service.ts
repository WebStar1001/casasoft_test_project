import {Injectable} from '@angular/core';
import Auth, {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth';
import {Hub, ICredentials} from '@aws-amplify/core';
import {Subject, Observable, BehaviorSubject} from 'rxjs';
import {CognitoUser} from 'amazon-cognito-identity-js';

export interface NewUser {
    email: string,
    password: string,
    firstName: string,
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public loggedIn: boolean;
    private _authState: Subject<CognitoUser | any> = new Subject<CognitoUser | any>();

    authState: Observable<CognitoUser | any> = this._authState.asObservable();

    isLoading$: Observable<boolean>;

    isLoadingSubject: BehaviorSubject<boolean>;

    public static SIGN_IN = 'signIn';
    public static SIGN_OUT = 'signOut';
    public static FACEBOOK = CognitoHostedUIIdentityProvider.Facebook;
    public static GOOGLE = CognitoHostedUIIdentityProvider.Google;

    constructor() {
        Hub.listen('auth', (data) => {
            const {channel, payload} = data;
            if (channel === 'auth') {
                this._authState.next(payload.event);
            }
        });
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.isLoading$ = this.isLoadingSubject.asObservable();
    }

    signUp(user: NewUser): Promise<CognitoUser | any> {
        return Auth.signUp({
            "username": user.email,
            "password": user.password,
            "attributes": {
                "email": user.email,
                "given_name": user.firstName,
            }
        });
    }

    signIn(username: string, password: string): Promise<CognitoUser | any> {
        this.isLoadingSubject.next(true);
        return new Promise((resolve, reject) => {
            Auth.signIn(username, password)
                .then((user: CognitoUser | any) => {
                    this.loggedIn = true;
                    console.log(user);
                    this.isLoadingSubject.next(false);
                    resolve(user);
                }).catch((error: any) => {
                    console.log(error);
                    reject(error);
                    this.isLoadingSubject.next(false);
                });
        });
    }

    signOut(): Promise<any> {
        return Auth.signOut()
            .then(() => this.loggedIn = false)
    }

    socialSignIn(provider: CognitoHostedUIIdentityProvider): Promise<ICredentials> {
        return Auth.federatedSignIn({
            'provider': provider
        });
    }

}

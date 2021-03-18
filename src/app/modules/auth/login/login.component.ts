import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Auth} from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import {Subscription, Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {AuthService} from '../_services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    defaultAuth: any = {
        email: '',
        password: '',
    };
    loginForm: FormGroup;
    hasError: boolean;
    errorMessage: String;
    returnUrl: string;
    isLoading$: Observable<boolean>;

    // private fields
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.isLoading$ = this.authService.isLoading$;
        // redirect to home if already logged in
    }

    ngOnInit(): void {
        this.initForm();
        // get return url from route parameters or default to '/'
        this.returnUrl =
            this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    initForm() {
        this.loginForm = this.fb.group({
            email: [
                this.defaultAuth.email,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
                ]),
            ],
            password: [
                this.defaultAuth.password,
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                ]),
            ],
        });
    }

    submit() {
        this.hasError = false;
        this.authService.signIn(this.f.email.value.toString(), this.f.password.value.toString())
            .then((user: CognitoUser|any) => {
                // console.log(user);return;
                this.router.navigate(['nutritional/ingredients']);
            })
            .catch((error: any) => {
                this.hasError = true;
                this.errorMessage = error.message;
            })
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}

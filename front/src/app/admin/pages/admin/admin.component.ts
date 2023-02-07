import { HttpErrorResponse } from '@angular/common/http';
import { Component, Type, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user';
import {
  UserErrorMessages,
  UsersService,
} from 'src/app/services/users.service';
import {
  AdminAlertComponent,
  AlertTypes,
} from '../../components/alert/alert.component';
import { AdminFormFields } from '../../components/form/interfaces/form.interface';
import { AlertDirective } from '../../components/alert/alert.directive';
import { DynamicAlertsComponent } from '../../components/alert/dynamicAlerts.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent extends DynamicAlertsComponent {
  public user = {} as User;
  public users: User[] | undefined;

  public hiddenSidebar: boolean = false;
  public hiddenTable: boolean = false;
  public hiddenForm: boolean = true;

  public iconPath: string = '';

  public formFields: AdminFormFields[] = [];

  constructor(private userService: UsersService) {
    super();
  }

  ngOnInit() {
    this.getUsers();
  }

  toggleSidebar(hiddenSidebar: boolean) {
    this.hiddenSidebar = hiddenSidebar;
  }

  openUserForm(user?: User) {
    if (user) {
      // TODO: Edit form
    } else {
      this.hiddenTable = true;
      this.hiddenForm = false;
    }
  }

  hiddenUserForm(status?: boolean) {
    if (status) this.hiddenForm = status;
    else this.hiddenForm = false;
    this.hiddenTable = false;
  }

  getUsers() {
    this.userService
      .getUsers()
      .subscribe((response: { result: User[]; total: number }) => {
        this.users = response.result;
      });
  }

  saveUser(form: NgForm) {
    // this.user = form.value;
    if (this.user.id !== undefined) {
      // implements
    } else {
      console.log(form);
      // this.userService.createUser(this.user).subscribe(
      //   () => {
      //     this.hiddenForm = true;
      //     this.cleanForm(form);
      //   },
      //   (httpErrorResponse: HttpErrorResponse) => {
      //     const { error } = httpErrorResponse;
      //     if (error.message == UserErrorMessages.REPEATED_EMAIL) {
      //       this.createAlert(
      //         AlertTypes.ERROR,
      //         'Usuário com este e-mail já existe'
      //       );
      //     }
      //   }
      // );
    }
  }

  cleanForm(form: NgForm) {
    this.getUsers();
    form.resetForm();
    this.user = {} as User;
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user';
import {
  UserErrorMessages,
  UsersService,
} from 'src/app/services/users.service';
import { AlertTypes } from '../../components/alert/alert.component';
import { DynamicAlertsComponent } from '../../components/alert/dynamicAlerts.component';
import { FormTypes } from '../../components/form/enums/form-types.enum';
import { AdminFormFields } from '../../components/form/interfaces/form.interface';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class AdminUsersComponent extends DynamicAlertsComponent {
  public user = {} as User;
  public users: User[] | undefined;

  public search: string = '';
  public total: number | undefined;
  public currentPage: number | undefined;
  public totalPages: number | undefined;
  public limit: number = 10;
  public skip: number = 0;

  public hiddenSidebar: boolean = false;
  public hiddenTable: boolean = false;

  public formTitle: string = 'Cadastro de usuário';
  public formType: FormTypes = FormTypes.CREATE;
  public hiddenForm: boolean = true;

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
      this.formType = FormTypes.EDIT;
      this.formTitle = 'Editar usuário';
      this.user = user;
      this.formFields = [
        {
          label: 'Nome:',
          name: 'name',
          type: 'text',
          placeholder: 'Digite o nome do usuário...',
          value: this.user.name,
          required: true,
        },
        {
          label: 'E-mail:',
          name: 'email',
          type: 'email',
          placeholder: 'Digite o e-mail do usuário ...',
          value: this.user.email,
          required: true,
        },
      ];
    } else {
      this.formType = FormTypes.CREATE;
      this.formFields = [
        {
          label: 'Nome:',
          name: 'name',
          type: 'text',
          placeholder: 'Digite o nome do usuário...',
          value: this.user.name,
          required: true,
        },
        {
          label: 'E-mail:',
          name: 'email',
          type: 'email',
          placeholder: 'Digite o e-mail do usuário ...',
          value: this.user.email,
          required: true,
        },
        {
          label: 'Senha:',
          name: 'password',
          type: 'password',
          placeholder: 'Digite a senha do usuário ...',
          value: this.user.password,
          required: true,
        },
      ];
    }

    this.hiddenTable = true;
    this.hiddenForm = false;
  }

  openChangePasswordForm(user: User) {
    this.user = user;
    this.formType = FormTypes.CHANGE_PASSWORD;
    this.formTitle = 'Alteração da senha';
    this.formFields = [
      {
        label: 'Senha atual:',
        name: 'currentPassword',
        type: 'password',
        value: '',
        required: true,
        placeholder: 'Digite a senha atual deste usuário ...',
      },
      {
        label: 'Nova senha:',
        name: 'newPassword',
        type: 'password',
        value: '',
        required: true,
        placeholder: 'Digite a nova senha para este usuário ...',
      },
    ];

    this.hiddenTable = true;
    this.hiddenForm = false;
  }

  hiddenUserForm() {
    this.hiddenForm = true;
    this.hiddenTable = false;
    this.user = {} as User;
  }

  onSearchUsers(event: any) {
    this.search = event.target.value;
    this.skip = 0;
    this.getUsers(this.search);
  }

  updatePage(skip: number) {
    this.skip = skip;
    this.getUsers(this.search);
  }

  getUsers(search = '') {
    this.userService
      .getUsers(search, this.limit, this.skip)
      .subscribe((response: { result: User[]; total: number }) => {
        this.users = response.result;
        this.total = response.total;
        this.currentPage = this.skip / this.limit + 1;
        this.totalPages =
          response.total / this.limit < 1
            ? 1
            : Math.ceil(response.total / this.limit);
      });
  }

  createUser(form: NgForm) {
    this.userService.createUser(form.value).subscribe({
      complete: () => {
        this.handleUserSuccess('Usuario criado com sucesso', form);
      },
      error: (httpErrorResponse: HttpErrorResponse) =>
        this.handleUserErrors(httpErrorResponse),
    });
  }

  editUser(form: NgForm) {
    this.userService.updateUser(this.user.id, form.value).subscribe({
      complete: () => {
        this.handleUserSuccess('Usuario atualizado com sucesso', form);
      },
      error: (httpErrorResponse: HttpErrorResponse) =>
        this.handleUserErrors(httpErrorResponse),
    });
  }

  changePassword(form: NgForm) {
    this.user.password = form.value.currentPassword;
    this.userService.checkPassword(this.user.id, this.user).subscribe((res) => {
      if (!res) {
        this.createAlert(AlertTypes.ERROR, 'Senha informada está incorreta.');
        return;
      }
      this.userService.changePassword(this.user.id, form.value).subscribe({
        complete: () => {
          this.handleUserSuccess(
            'Senha de usuário atualizada com sucesso',
            form
          );
        },
        error: (httpErrorResponse: HttpErrorResponse) =>
          this.handleUserErrors(httpErrorResponse),
      });
    }, this.handleUserErrors);
  }

  removeUser(user: User) {
    this.userService.removeUser(user.id).subscribe({
      complete: () => {
        this.handleUserSuccess('Usuário removido com sucesso');
      },
      error: (httpErrorResponse: HttpErrorResponse) =>
        this.handleUserErrors(httpErrorResponse),
    });
  }

  submitForm(form: NgForm) {
    if (this.formType == FormTypes.EDIT) {
      this.editUser(form);
    } else if (this.formType == FormTypes.CREATE) {
      this.createUser(form);
    } else {
      this.changePassword(form);
    }
  }

  cleanForm(form: NgForm) {
    form.resetForm();
    this.hiddenUserForm();
  }

  handleUserSuccess(message: string, form?: NgForm) {
    this.createAlert(AlertTypes.SUCCESS, message);
    if (form) this.cleanForm(form);
    this.getUsers();
  }

  handleUserErrors(httpErrorResponse: HttpErrorResponse) {
    const { error } = httpErrorResponse;
    if (error.message == UserErrorMessages.REPEATED_EMAIL) {
      this.createAlert(AlertTypes.ERROR, 'Usuário com este e-mail já existe');
    }
  }
}

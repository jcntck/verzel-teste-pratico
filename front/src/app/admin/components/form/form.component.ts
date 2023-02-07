import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { environment } from 'src/environments/environments';
import { AdminFormFields } from './interfaces/form.interface';

@Component({
  selector: 'app-admin-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class AdminFormComponent {
  entity = {} as any;
  public hiddenOptions = {};

  @Input() formTitle: string | undefined;
  @Input() formFields: AdminFormFields[] = [];
  @Output() saveEntityEvent = new EventEmitter<NgForm>();
  @Output() backPageEvent = new EventEmitter<NgForm>();
  @Output() searchResultsEvent = new EventEmitter<string>();

  constructor(private fileUploadService: FileUploadService) {}

  ngOnInit() {
    // for(let field of this.formFields) {
    //   if (field)
    // }
  }

  saveEntity(form: NgForm) {
    this.saveEntityEvent.emit(form);
  }

  backPage() {
    this.backPageEvent.emit();
  }

  loadOptions(event: any) {
    const [prefix] = event.target.id.split('.');

    const field = this.formFields.find(
      (field) => field.prefix == prefix && field.type == 'select'
    );
    if (field!.hiddenOptions) {
      if (field!.filterBy) {
        const filterByField = this.formFields.find(
          (filterField) =>
            filterField.prefix == field!.filterBy &&
            filterField.type == 'select'
        );

        if (!filterByField!.id) return;
        field!.baseOptions = field!.options!.filter(
          (option) => option[field!.filterBy!].id == filterByField!.id
        );
      } else {
        field!.baseOptions = field!.options;
      }

      field!.filteredOptions = field!.baseOptions;

      field!.hiddenOptions = false;
    } else {
      field!.hiddenOptions = true;
    }
  }

  selectOption(event: any) {
    const span = event.target.querySelector('span');
    const [prefix, id] = span.id.split('.');

    const field = this.formFields.find(
      (field) => field.prefix == prefix && field.type == 'select'
    );

    if (field) {
      field.id = id;
      field.value = span.innerText;

      const option = field.filteredOptions!.find((option) => option.id == id);
      if (option.iconPath) {
        const fieldImage = this.formFields.find(
          (field) => field.prefix == prefix && field.type == 'file'
        );

        fieldImage!.value = option.iconPath;
      }
    }
    field!.hiddenOptions = true;
  }

  checkValue(event: any) {
    const [prefix, name] = event.target.id.split('.');
    const value = event.target.value;
    const field = this.formFields.find(
      (field) => field.prefix == prefix && field.name == name
    );
    if (!value) {
      field!.id = null;
      const optionImage = this.formFields.find(
        (field) => field.prefix === prefix && field.type == 'file'
      );
      if (optionImage) optionImage.value = null;
      field!.hiddenOptions = true;
      return;
    }
    const regExp = new RegExp(`${value}`, 'i');
    const options = field!.filteredOptions!.filter((option) =>
      Array.isArray(option.name.match(regExp))
    );
    if (options.length > 1) return;
    const [option] = options;
    if (option) {
      field!.id = option.id;
      field!.value = option.name;
      if (option.iconPath) {
        const fieldImage = this.formFields.find(
          (field) => field.prefix == prefix && field.type == 'file'
        );
        fieldImage!.value = option.iconPath;
      }
    } else {
      field!.id = null;
      const optionImage = this.formFields.find(
        (field) => field.prefix === prefix && field.type == 'file'
      );
      if (optionImage) optionImage.value = null;
    }
    field!.hiddenOptions = true;
  }

  searchResults(event: any) {
    const [prefix, name] = event.target.id.split('.');
    const value = event.target.value;
    const field = this.formFields.find(
      (field) => field.prefix == prefix && field.name == name
    );

    if (field!.baseOptions) {
      const regExp = new RegExp(`${event.target.value}`, 'i');
      field!.filteredOptions = field!.baseOptions!.filter((option) =>
        Array.isArray(option.name.match(regExp))
      );
    } else {
      field!.filteredOptions = [];
    }
  }

  uploadFile(event: any) {
    const prefix = event.target.name.split('.')[0];
    const field = this.formFields.find(
      (field) => field.prefix == prefix && field.type == 'file'
    );
    const file = event.target.files[0];
    this.fileUploadService.upload(file).subscribe((response) => {
      field!.value = `${environment.UPLOADCARE_CDN}/${response.file}/`;
    });
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { AdminFormFields } from './interfaces/form.interface';

@Component({
  selector: 'app-admin-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class AdminFormComponent {
  entity = {} as any;
  public cdnUrl = 'https://ucarecdn.com';

  @Input() formTitle: string | undefined;
  @Input() formFields: AdminFormFields[] = [];
  @Output() saveEntityEvent = new EventEmitter<NgForm>();
  @Output() backPageEvent = new EventEmitter<NgForm>();

  constructor(private fileUploadService: FileUploadService) {}

  saveEntity(form: NgForm) {
    this.saveEntityEvent.emit(form);
  }

  backPage() {
    this.backPageEvent.emit();
  }

  uploadFile(event: any) {
    const name = event.target.name.split('_')[0];
    const field = this.formFields.find((field) => field.name == name);
    const file = event.target.files[0];
    this.fileUploadService.upload(file).subscribe((response) => {
      field!.value = `${this.cdnUrl}/${response.file}/`;
    });
  }
}

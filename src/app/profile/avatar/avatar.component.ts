import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from '../../employees/employee.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  currentEmployee: Employee | null = null;
  selectedFile: File | null = null;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<AvatarComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCurrentEmployee();
  }

  loadCurrentEmployee() {
    this.employeeService.getCurrentEmployee().subscribe(
      (data) => {
        this.currentEmployee = data;
      },
      (error) => {
        console.error('Ошибка при выборе текущего сотрудника', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  uploadAvatar(): void {
    if (this.croppedImage && this.currentEmployee) {
      const base64ImageBlob = this.dataURItoBlob(this.croppedImage);
      const file = this.blobToFile(base64ImageBlob, 'avatar.jpeg');

      const formData = new FormData();
      formData.append('image', file);

      this.employeeService.uploadEmployeeAvatar(this.currentEmployee.id, formData).subscribe(
        () => {
          this.snackBar.open('Аватар успешно загружен', 'Закрыть', {
            duration: 3000,
            verticalPosition: 'bottom',
          });
          this.dialogRef.close();
          this.loadCurrentEmployee();
        },
        (error) => {
          this.snackBar.open('Ошибка в загрузке аватара!', 'Закрыть', {
            duration: 3000,
            verticalPosition: 'bottom',
          });
        }
      );
    }
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  blobToFile(blob: Blob, fileName: string): File {
    const file: File = new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
    return file;
  }
}

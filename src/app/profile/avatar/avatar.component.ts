import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from '../../employees/employee.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';

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

  constructor(private employeeService: EmployeeService, private dialogRef: MatDialogRef<AvatarComponent>) {}

  ngOnInit(): void {
    this.loadCurrentEmployee();
  }

  loadCurrentEmployee() {
    this.employeeService.getCurrentEmployee().subscribe(
      (data) => {
        this.currentEmployee = data;
      },
      (error) => {
        console.error('Error fetching current employee', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.imageChangedEvent = event; // Сохраняем событие для обрезки изображения
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64; // Сохраняем обрезанное изображение в формате Base64
  }

  uploadAvatar(): void {
    if (this.croppedImage && this.currentEmployee) {
      const base64ImageBlob = this.dataURItoBlob(this.croppedImage);
      const file = this.blobToFile(base64ImageBlob, 'avatar.jpeg'); // Преобразуем Blob в File

      const formData = new FormData();
      formData.append('image', file); // Используем ключ 'image' для загрузки файла, как требует бэкенд

      this.employeeService.uploadEmployeeAvatar(this.currentEmployee.id, formData).subscribe(
        () => {
          console.log('Аватар успешно загружен');
          this.dialogRef.close();
          this.loadCurrentEmployee(); // Обновляем данные сотрудника после загрузки аватара
        },
        (error) => {
          console.error('Ошибка загрузки аватара', error);
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

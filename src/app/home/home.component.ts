import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private readonly CV_FILE_URL = 'assets/docs/CV_Teklit_TEWOLDE_Developpeur_Java.pdf';
  private readonly CV_FILE_NAME = 'CV_Teklit_TEWOLDE_Developpeur_Java.pdf';
  linkedLink: string = 'https://www.linkedin.com/in/teklittewolde';

  onDownloadCV(): void {
    this.checkFileExists(this.CV_FILE_URL)
      .then(() => this.downloadFile(this.CV_FILE_URL, this.CV_FILE_NAME))
      .catch(error => console.error('Download failed:', error));
  }

  private downloadFile(fileUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private async checkFileExists(fileUrl: string): Promise<void> {
    try {
      const response = await fetch(fileUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`File not found: ${fileUrl}`);
      }
    } catch (error) {
      throw new Error(`Error checking file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

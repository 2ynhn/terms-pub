
export interface ConversionResult {
  html: string;
  originalFileName: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  CONVERTING = 'CONVERTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

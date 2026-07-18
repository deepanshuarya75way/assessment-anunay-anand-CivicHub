export interface IAiProvider {
  generateText(prompt: string, context?: any): Promise<string>;
  analyzeSentiment(text: string): Promise<number>;
  moderateContent(text: string): Promise<boolean>;
}

export interface IEmailProvider {
  sendEmail(to: string, subject: string, body: string, isHtml?: boolean): Promise<boolean>;
}

export interface IStorageProvider {
  uploadFile(file: Buffer, filename: string, mimetype: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<boolean>;
}

export interface INotificationProvider {
  sendPush(userId: string, title: string, body: string): Promise<boolean>;
}

export interface IMapsProvider {
  geocode(address: string): Promise<{ lat: number; lng: number } | null>;
  reverseGeocode(lat: number, lng: number): Promise<string | null>;
}

export interface ISearchProvider {
  indexDocument(index: string, id: string, data: any): Promise<void>;
  search(index: string, query: string, filters?: any): Promise<any[]>;
  deleteDocument(index: string, id: string): Promise<void>;
}

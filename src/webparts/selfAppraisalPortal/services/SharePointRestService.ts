import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { ErrorHelper } from '../utils/ErrorHelper';

export class SharePointRestService {
  private spHttpClient: SPHttpClient;
  private webAbsoluteUrl: string;

  public constructor(spHttpClient: SPHttpClient, webAbsoluteUrl: string) {
    this.spHttpClient = spHttpClient;
    this.webAbsoluteUrl = webAbsoluteUrl.replace(/\/$/, '');
  }

  public async getItems<T>(listTitle: string, query: string): Promise<T[]> {
    const endpoint = `${this.webAbsoluteUrl}/_api/web/lists/getByTitle('${encodeURIComponent(listTitle)}')/items${decodeURIComponent(query)}`;
    const response = await this.requestWithRetry(() => this.spHttpClient.get(endpoint, SPHttpClient.configurations.v1, {
      headers: { Accept: 'application/json;odata=nometadata' }
    }));
    const data = await response.json();
    return data.value || [];
  }

  public async addItem<T>(listTitle: string, body: unknown): Promise<T> {
    const endpoint = `${this.webAbsoluteUrl}/_api/web/lists/getByTitle('${encodeURIComponent(listTitle)}')/items`;
    const response = await this.requestWithRetry(() => this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
      headers: {
        Accept: 'application/json;odata=nometadata',
        'Content-Type': 'application/json;odata=nometadata'
      },
      body: JSON.stringify(body)
    }));
    return response.json();
  }

  public async updateItem(listTitle: string, id: number, body: unknown): Promise<void> {
    const endpoint = `${this.webAbsoluteUrl}/_api/web/lists/getByTitle('${encodeURIComponent(listTitle)}')/items(${id})`;
    await this.requestWithRetry(() => this.spHttpClient.fetch(endpoint, SPHttpClient.configurations.v1, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json;odata=nometadata',
        'Content-Type': 'application/json;odata=nometadata',
        'IF-MATCH': '*'
      },
      body: JSON.stringify(body)
    }));
  }

  public async deleteItem(listTitle: string, id: number): Promise<void> {
    const endpoint = `${this.webAbsoluteUrl}/_api/web/lists/getByTitle('${encodeURIComponent(listTitle)}')/items(${id})`;
    await this.requestWithRetry(() => this.spHttpClient.fetch(endpoint, SPHttpClient.configurations.v1, {
      method: 'DELETE',
      headers: { 'IF-MATCH': '*' }
    }));
  }

  public async addFile(folderServerRelativeUrl: string, fileName: string, file: File): Promise<void> {
    await this.ensureFolderPath(folderServerRelativeUrl);
    const buffer = await file.arrayBuffer();
    const endpoint = `${this.webAbsoluteUrl}/_api/web/GetFolderByServerRelativeUrl('${encodeURIComponent(folderServerRelativeUrl)}')/Files/add(url='${encodeURIComponent(fileName)}',overwrite=true)`;
    await this.requestWithRetry(() => this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
      headers: { Accept: 'application/json;odata=nometadata' },
      body: buffer
    }));
  }

  public async deleteFile(fileServerRelativeUrl: string): Promise<void> {
    const endpoint = `${this.webAbsoluteUrl}/_api/web/GetFileByServerRelativeUrl('${encodeURIComponent(fileServerRelativeUrl)}')`;
    await this.requestWithRetry(() => this.spHttpClient.fetch(endpoint, SPHttpClient.configurations.v1, {
      method: 'DELETE',
      headers: { 'IF-MATCH': '*' }
    }));
  }

  private async requestWithRetry(execute: () => Promise<SPHttpClientResponse>): Promise<SPHttpClientResponse> {
    let attempts = 0;
    while (attempts < 2) {
      attempts++;
      try {
        const response = await execute();
        if (response.ok) {
          return response;
        }
        if (attempts >= 2) {
          const text = await response.text();
          throw new Error(ErrorHelper.toUserMessage(text, 'SharePoint request failed.'));
        }
      } catch (error) {
        if (attempts >= 2) {
          throw new Error(ErrorHelper.toUserMessage(error, 'SharePoint request failed.'));
        }
      }
    }

    throw new Error('SharePoint request failed.');
  }

  private async ensureFolderPath(folderServerRelativeUrl: string): Promise<void> {
    const segments = folderServerRelativeUrl.split('/').filter(Boolean);
    if (segments.length < 2) {
      return;
    }

    let current = `/${segments[0]}`;
    for (let index = 1; index < segments.length; index++) {
      const folderName = segments[index];
      const endpoint = `${this.webAbsoluteUrl}/_api/web/GetFolderByServerRelativeUrl('${encodeURIComponent(current)}')/Folders/add('${encodeURIComponent(folderName)}')`;
      try {
        await this.spHttpClient.post(endpoint, SPHttpClient.configurations.v1, {
          headers: { Accept: 'application/json;odata=nometadata' }
        });
      } catch (error) {
        // Ignore if folder already exists and continue building the path.
      }
      current = `${current}/${folderName}`;
    }
  }
}

import { LIBRARIES } from '../constants/LibraryNames';
import { IAppraisalDocument } from '../models/Appraisal';
import { SharePointRestService } from './SharePointRestService';

export class DocumentService {
  private restService: SharePointRestService;

  public constructor(restService: SharePointRestService) {
    this.restService = restService;
  }

  public async getDocuments(appraisalResponseId: number): Promise<IAppraisalDocument[]> {
    const items = await this.restService.getItems<any>(LIBRARIES.AppraisalDocuments, `?$filter=AppraisalResponseId eq ${appraisalResponseId}`);
    return items.map((item: any) => ({
      id: item.Id,
      fileLeafRef: item.FileLeafRef || '',
      employeeId: item.EmployeeId,
      appraisalResponseId: item.AppraisalResponseId,
      cycleId: item.CycleId,
      fileServerRelativeUrl: item.FileRef,
      sizeKb: Number(item.File_x0020_Size || 0),
      created: item.Created
    }));
  }

  public async addDocument(document: IAppraisalDocument, file: File, folderServerRelativeUrl: string): Promise<IAppraisalDocument> {
    await this.restService.addFile(folderServerRelativeUrl, file.name, file);
    const saved = await this.restService.addItem<any>(LIBRARIES.AppraisalDocuments, {
      Title: file.name,
      FileLeafRef: file.name,
      EmployeeId: document.employeeId,
      AppraisalResponseId: document.appraisalResponseId,
      CycleId: document.cycleId
    });
    return { ...document, id: saved.Id, fileLeafRef: file.name, fileServerRelativeUrl: `${folderServerRelativeUrl}/${file.name}` };
  }

  public async deleteDocument(documentId: number, fileServerRelativeUrl?: string): Promise<void> {
    if (fileServerRelativeUrl) {
      await this.restService.deleteFile(fileServerRelativeUrl);
    }
    await this.restService.deleteItem(LIBRARIES.AppraisalDocuments, documentId);
  }
}

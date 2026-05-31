import { LIBRARIES } from '../constants/LibraryNames';
import { IAppraisalDocument } from '../models/Appraisal';
import { mockDocuments } from './MockData';
import { SharePointService } from './SharePointService';

export class DocumentService {
  public static async getDocuments(appraisalHeaderId: number): Promise<IAppraisalDocument[]> {
    const documents = await SharePointService.getItems<IAppraisalDocument>(LIBRARIES.AppraisalDocuments, mockDocuments);
    return documents.filter(document => document.appraisalHeaderId === appraisalHeaderId);
  }

  public static async addDocument(document: IAppraisalDocument): Promise<IAppraisalDocument> {
    return SharePointService.saveItem<IAppraisalDocument>(LIBRARIES.AppraisalDocuments, mockDocuments, document);
  }
}


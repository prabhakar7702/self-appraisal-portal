import { ErrorHelper } from '../utils/ErrorHelper';

export interface ISharePointEntity {
  id: number;
}

export class SharePointService {
  public static async getItems<T>(listName: string, items: T[]): Promise<T[]> {
    try {
      return Promise.resolve(items);
    } catch (error) {
      throw new Error(ErrorHelper.toUserMessage(error, `Unable to load ${listName}.`));
    }
  }

  public static async saveItem<T extends ISharePointEntity>(listName: string, items: T[], item: T): Promise<T> {
    try {
      const index = items.map(existing => existing.id).indexOf(item.id);
      if (index >= 0) {
        items[index] = item;
      } else {
        items.push(item);
      }

      return Promise.resolve(item);
    } catch (error) {
      throw new Error(ErrorHelper.toUserMessage(error, `Unable to save ${listName}.`));
    }
  }
}


import { CreateModelDto } from 'src/models/dto/create-model.dto';
import { UpdateModelDto } from 'src/models/dto/update-model.dto';

export class ModelsMock {
  static CREATE_NAME: string = 'Polo';
  static UPDATE_NAME: string = 'Siena';
  static CREATE_BRANDID: number;
  static UPDATE_BRANDID: number;

  static create(): CreateModelDto {
    return {
      name: ModelsMock.CREATE_NAME,
      brandId: ModelsMock.CREATE_BRANDID,
    };
  }

  static update(): UpdateModelDto {
    return {
      name: ModelsMock.UPDATE_NAME,
      brandId: ModelsMock.UPDATE_BRANDID,
    };
  }
}

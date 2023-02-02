import { CreateBrandDto } from 'src/brands/dto/create-brand.dto';
import { UpdateBrandDto } from 'src/brands/dto/update-brand.dto';

type IconPath = {
  iconPath: string | null;
};

export class BrandsMock {
  static CREATE_NAME: string = 'Brand Test';
  static UPDATE_NAME: string = 'Brand Test 1';

  static create(): CreateBrandDto {
    return {
      name: BrandsMock.CREATE_NAME,
    };
  }

  static update(): UpdateBrandDto {
    return {
      name: BrandsMock.UPDATE_NAME,
    };
  }

  static setIconPath(): IconPath {
    return {
      iconPath: '/test/test/test/test.png',
    };
  }

  static removeIconPath(): IconPath {
    return {
      iconPath: null,
    };
  }
}

import { CreateBrandDto } from 'src/brands/dto/create-brand.dto';
import { UpdateBrandDto } from 'src/brands/dto/update-brand.dto';

type IconPath = {
  iconPath: string | null;
};

export class BrandsMock {
  static create(): CreateBrandDto {
    return {
      name: 'Volkswagen',
    };
  }

  static update(): UpdateBrandDto {
    return {
      name: 'Fiat',
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

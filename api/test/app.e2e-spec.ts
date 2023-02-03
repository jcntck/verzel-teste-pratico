import brandsTestGroup from './groups/brands-test.group';
import modelsTestGroup from './groups/models-test.group';
import usersTestGroup from './groups/users-test.group';
import vehiclesTestGroup from './groups/vehicles-test.group';

describe('Testing API', () => {
  describe('Users', usersTestGroup);
  describe('Brands', brandsTestGroup);
  describe('Models', modelsTestGroup);
  describe('Vehicles', vehiclesTestGroup);
});

import Apimanager from './../app/data/api'

describe('API Global Data', () => {
  let data;
  beforeEach(async () => {
    const param = {
      source: 'jhu',
    };
    data = await Apimanager.getLocations(param);
  });
  it('Global response status', () => {
    expect(data.status).toEqual('success');
  });
});

describe('API Location Data', () => {
  let data;
  beforeEach(async () => {
    const param = {
      source: 'jhu',
      country_code: 'ID',
    };

    data = await Apimanager.getLocations(param);
  });
  it('Location response status', () => {
    expect(data.status).toEqual('success');
  });
});
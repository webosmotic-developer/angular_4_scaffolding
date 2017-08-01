import { ParcelPortPage } from './app.po';

describe('parcel-port App', () => {
  let page: ParcelPortPage;

  beforeEach(() => {
    page = new ParcelPortPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

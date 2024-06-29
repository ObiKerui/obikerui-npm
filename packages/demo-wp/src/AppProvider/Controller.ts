import { tAppModel } from './Model';

class AppController {
  model: tAppModel;
  notify: ((newModel: tAppModel) => void) | null;

  constructor(model: tAppModel) {
    this.model = model;
    this.notify = null;
  }

  updateTheme(newTheme: 'light' | 'dark') {
    this.model.theme = newTheme;

    if (this.notify) this.notify(this.model);
  }
}

export { AppController };

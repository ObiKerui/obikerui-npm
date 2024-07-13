import { CContainer } from './Container';

class ClipPathGenerator {
  container: CContainer;

  constructor(container: CContainer) {
    this.container = container;
  }

  updateClipPath() {
    const { container } = this;
    const { attrs } = container;

    if (!attrs.svg) {
      return;
    }
    console.log('add / update clip path...');
  }

  update() {
    this.updateClipPath();
  }
}

export { ClipPathGenerator };

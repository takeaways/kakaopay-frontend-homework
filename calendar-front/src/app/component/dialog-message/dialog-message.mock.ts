import { of } from 'rxjs';

export class DialogMessageMock {
  open() {
    return {
      afterClosed: () => of({ name: 'some object' })
    };
  }
}

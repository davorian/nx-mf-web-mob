import { render } from '@testing-library/react';

import WebLib2 from './web-lib2';

describe('WebLib2', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<WebLib2 />);
    expect(baseElement).toBeTruthy();
  });
  
});

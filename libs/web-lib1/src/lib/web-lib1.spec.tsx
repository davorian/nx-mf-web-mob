import { render } from '@testing-library/react';

import WebLib1 from './web-lib1';

describe('WebLib1', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<WebLib1 />);
    expect(baseElement).toBeTruthy();
  });
  
});

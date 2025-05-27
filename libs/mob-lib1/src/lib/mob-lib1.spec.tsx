import { render } from '@testing-library/react';

import MobLib1 from './mob-lib1';

describe('MobLib1', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<MobLib1 />);
    expect(baseElement).toBeTruthy();
  });
  
});

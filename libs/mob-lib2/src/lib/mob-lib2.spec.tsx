import { render } from '@testing-library/react';

import MobLib2 from './mob-lib2';

describe('MobLib2', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<MobLib2 />);
    expect(baseElement).toBeTruthy();
  });
  
});

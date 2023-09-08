import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});
{/* <script>
"resources": "cordova-res ios && cordova-res android && node scripts/resources.js"
</script> */}

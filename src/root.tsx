// src/root.tsx
import { initTheme } from './lib/ui/theme';
import './app.css';

initTheme();

export default function Root() {
  return (
    <html lang="en">
      <body>
        {/* your app shell */}
      </body>
    </html>
  );
}

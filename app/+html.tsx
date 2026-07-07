// app/+html.tsx

import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Fixes scroll behavior on web to match native ScrollView more closely */}
        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: fullHeightReset }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const fullHeightReset = `
html, body, #root {
  height: 100%;
}
body {
  margin: 0;
}
`;
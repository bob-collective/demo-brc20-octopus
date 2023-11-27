const getIframeSource = (decodedString: string) => `
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="format-detection" content="telephone=no">
    <style>
      html {
        background-color: #131516;
        color: white;
        font-size: 16px;
        height: 100%;
        line-height: 1;
      }
      
      body {
        display: grid;
        grid-template: 1fr / 1fr;
        height: 100%;
        margin: 0;
        place-items: center;
      }
      
      pre {
        margin: 0;
      }
      
      body > * {
        grid-column: 1 / 1;
        grid-row: 1 / 1;
      }
      
      body > pre {
        opacity: 0;
      }
    </style>              
  </head>
  <body>
    <pre style="font-size: min(5.2598vw, 95vh); opacity: 1;">${decodedString}</pre>
    <noscript>
      <pre>${decodedString}</pre>
    </noscript>
  </body>
</html>`;

export { getIframeSource };

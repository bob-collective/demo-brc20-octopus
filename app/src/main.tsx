import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InterlayUIProvider } from "@interlay/system";
import { CSSReset } from "@interlay/ui";
import "@interlay/theme/dist/bob.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <InterlayUIProvider>
        <CSSReset />
        <App />
      </InterlayUIProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

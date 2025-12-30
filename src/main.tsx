import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

import { ThirdwebProvider } from "thirdweb/react";

createRoot(document.getElementById("root")!).render(
  <ThirdwebProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThirdwebProvider>
);

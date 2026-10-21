import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const replicateApiKey =
    env.replicate_api_key ||
    env.VITE_REPLICATE_API_KEY ||
    env.REPLICATE_API_KEY ||
    process.env.replicate_api_key ||
    process.env.VITE_REPLICATE_API_KEY ||
    process.env.REPLICATE_API_KEY ||
    "";

  return {
    define: {
      "import.meta.env.replicate_api_key": JSON.stringify(replicateApiKey),
      "import.meta.env.VITE_REPLICATE_API_KEY": JSON.stringify(replicateApiKey),
    },
    envPrefix: ["VITE_", "replicate_"],
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api/replicate": {
          target: "https://api.replicate.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/replicate/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (!proxyReq.getHeader("authorization") && replicateApiKey) {
                proxyReq.setHeader("authorization", `Bearer ${replicateApiKey}`);
              }
            });
          },
        },
      },
    },
    preview: {
      host: "::",
      port: 8080,
      proxy: {
        "/api/replicate": {
          target: "https://api.replicate.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/replicate/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (!proxyReq.getHeader("authorization") && replicateApiKey) {
                proxyReq.setHeader("authorization", `Bearer ${replicateApiKey}`);
              }
            });
          },
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

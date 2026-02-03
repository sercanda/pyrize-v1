const { startServer } = require("next/dist/server/lib/start-server");

const port = Number(process.env.PORT || 3000);
const hostname = "0.0.0.0";

startServer({
  dir: __dirname,
  isDev: false,
  hostname,
  port,
  keepAliveTimeout: 60000,
}).then(() => {
  console.log(`✅ Next.js running on http://${hostname}:${port}`);
});

// server.js (repo root)

process.env.HOSTNAME = "0.0.0.0";
process.env.HOST = "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";

require("./.next/standalone/server.js");

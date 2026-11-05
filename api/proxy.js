const { handleApi } = require("../backend/router");

module.exports = async (req, res) => {
  const host = req.headers.host || "event-sphere-lake.vercel.app";
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const incomingUrl = new URL(req.url, `${protocol}://${host}`);
  const rewrittenPath = incomingUrl.searchParams.get("path") || "";
  const normalizedPath = Array.isArray(rewrittenPath) ? rewrittenPath.join("/") : rewrittenPath;

  incomingUrl.pathname = `/api/${String(normalizedPath).replace(/^\/+/, "")}`;
  incomingUrl.searchParams.delete("path");

  return handleApi(req, res, incomingUrl);
};

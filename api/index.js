// Placeholder committed so Vercel's `functions` pattern in vercel.json
// ("api/index.js") resolves against a real file in the source tree before
// the build runs. scripts/build-api.mjs overwrites this with the real
// esbuild bundle of server/apiHandler.ts during every build - this file's
// content is never actually deployed.
export default function handler(_req, res) {
  res.statusCode = 500;
  res.end("Not built");
}

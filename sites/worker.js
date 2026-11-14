/**
 * Workers entrypoint for AFTERLIFE.
 *
 * The app is a static Vite/React SPA. This worker serves the built assets and
 * falls back to index.html for client-side routes (React Router) so deep links
 * such as /missions/ingenuity resolve instead of 404-ing.
 */
export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const url = new URL(request.url);
    // A missing file with an extension is a genuinely missing asset.
    if (/\.[a-z0-9]+$/i.test(url.pathname)) return response;

    if (request.method !== "GET" && request.method !== "HEAD") return response;

    const indexUrl = new URL("/index.html", url);
    return env.ASSETS.fetch(new Request(indexUrl, { method: request.method, headers: request.headers }));
  },
};

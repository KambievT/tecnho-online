/**
 * Next.js configuration for monorepo.
 * Set turbopack.root to the workspace root so Turbopack can resolve `next` and other deps.
 */
module.exports = {
  turbopack: {
    // adjust this path if your workspace root is elsewhere
    root: "../../",
  },
};

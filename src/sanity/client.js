import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "yv32mo3i",
  dataset: "production",
  apiVersion: "2026-10-19",
  useCdn: false,
});

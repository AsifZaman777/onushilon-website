import HomeClient from "./HomeClient";
import { getPublicContent, CONTENT_REVALIDATE_SECONDS } from "../lib/serverData";

// Prerendered at build time, refreshed in the background and on-demand from the CRM.
export const revalidate = CONTENT_REVALIDATE_SECONDS;

export default async function Page() {
  const initialData = await getPublicContent();
  return <HomeClient initialData={initialData} />;
}

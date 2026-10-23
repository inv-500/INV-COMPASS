import { notFound } from "next/navigation";

// /design is an internal page. There is no login yet, so it is hidden on the live (production) site
// and shown on previews and local runs. It only ever shows invented sample content.
export default function DesignLayout({ children }: LayoutProps<"/design">) {
  if (process.env.VERCEL_ENV === "production") notFound();
  return children;
}

import type { Metadata } from "next";
import { seoMetadata } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata("/book", {
    title: "Book an Online Coaching Discovery Call | Shift Left",
    description: "Book a complimentary 30-minute online discovery call for customized coaching, consulting, workshops, family support or organizational wellbeing programs.",
    keywords: ["online coaching consultation", "career coach consultation", "leadership coach consultation", "virtual coaching call"],
  });
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}

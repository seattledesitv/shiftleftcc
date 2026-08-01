import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import VisionBoardBuilder from "./VisionBoardBuilder";
import "../../dashboard.css";

export default async function VisionBoardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/my-journey/vision-board");

  const [{ data: areas }, { data: visions }, { data: items }, { data: boards }] = await Promise.all([
    supabase.from("life_areas").select("id,name,icon").eq("is_active", true).order("display_order"),
    supabase.from("annual_visions").select("id,year,title").eq("user_id", user.id).order("year", { ascending: false }),
    supabase.from("vision_board_items").select("id,title,affirmation,image_prompt,life_area_id,created_at").eq("user_id", user.id).order("display_order").order("created_at"),
    supabase.from("vision_boards").select("id,title,theme,layout,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(12),
  ]);

  return <main>
    <section className="pageHero compactHero dashboardHero">
      <p className="eyebrow">MY JOURNEY · VISION BOARD</p>
      <h1>Turn your vision into something you can see.</h1>
      <p className="lead">Add meaningful life aspirations, choose a visual theme, and generate a board that keeps your annual vision present and emotionally connected.</p>
    </section>
    <nav className="journeyNav"><Link href="/my-journey">Home</Link><Link href="/my-journey/foundation">Mission & Vision</Link><Link href="/my-journey/vision-board">Vision Board</Link><Link href="/my-journey/goals">Life Goals</Link><Link href="/my-journey/gratitude">Gratitude</Link><Link href="/my-journey/progress">Progress</Link></nav>
    <section className="memberDashboard">
      <VisionBoardBuilder areas={areas || []} visions={visions || []} items={items || []} />
      <div className="historyList savedBoards">
        <div className="dashboardCard"><p className="eyebrow">SAVED BOARDS</p><h2>{boards?.length || 0} generated board{boards?.length === 1 ? "" : "s"}</h2><p>Saved boards preserve the items, theme, and layout used at that point in your journey.</p></div>
        {(boards || []).map(board => <article className="dashboardCard" key={board.id}><p className="eyebrow">{new Date(board.created_at).toLocaleDateString()}</p><h2>{board.title}</h2><p>{board.theme.replaceAll("-", " ")} theme · {board.layout} layout</p></article>)}
      </div>
    </section>
  </main>;
}

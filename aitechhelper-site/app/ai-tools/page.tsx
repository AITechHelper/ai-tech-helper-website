import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import ToolsDirectory from "@/components/ToolsDirectory";
import { getTools } from "@/lib/tools.server";

export const metadata: Metadata = {
  title: "AI Tools — AI Tech Helper",
  description:
    "The AI tools worth your time, rated and sorted by what they actually do — automation, marketing, content, support, and more.",
};

export default function AiToolsPage() {
  const tools = getTools();

  return (
    <div className="page hub">
      <nav className="nav">
        <Logo />
        <div className="nav-links">
          <a href="/#stage">Agents</a>
          <a href="/#stage">Automations</a>
          <Link href="/ai-tools">AI Tools</Link>
          <Link href="/ai-hub">AI Hub</Link>
        </div>
        <a href="#" className="cta-pill">
          Contact Us
        </a>
      </nav>

      <header className="hub-head">
        <span className="eyebrow">AI Tools</span>
        <h1>The tools worth your time</h1>
        <p className="hub-sub">
          We try them so you don&rsquo;t have to. Every tool here is rated on what it actually
          does for a small business — not on how good its landing page looks.
        </p>
      </header>

      <div className="tools-wrap">
        <ToolsDirectory tools={tools} />
      </div>
    </div>
  );
}

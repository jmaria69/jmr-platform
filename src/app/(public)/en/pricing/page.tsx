"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Zap, ArrowRight, MessageSquare } from "lucide-react";

const PLANS = [
  {
    id: "essential",
    name: "Essential",
    price: 950,
    desc: "For businesses that want to automate one critical process first and see real results.",
    color: "#7c3aed",
    highlight: false,
    features: [
      "1 custom AI agent",
      "1 automated process",
      "Email / Google Workspace integrations",
      "Basic monitoring dashboard",
      "Email support (< 24h response)",
      "Guided onboarding included",
      "Maintenance updates",
    ],
    cta: "Start with Essential",
    ideal: "Ideal for: freelancers and SMBs with 1-10 people",
  },
  {
    id: "professional",
    name: "Professional",
    price: 1800,
    desc: "For teams that want to scale automation across several departments.",
    color: "#00d4ff",
    highlight: true,
    features: [
      "Up to 3 AI agents",
      "Up to 3 automated processes",
      "Advanced integrations (ERP, CRM, custom APIs)",
      "Real-time dashboard",
      "Priority support < 2h",
      "Monthly performance review",
      "Proactive improvement proposals",
      "Early access to new agents",
    ],
    cta: "Start with Professional",
    ideal: "Ideal for: companies with 10-50 people",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 3200,
    desc: "For organizations that need a complete automation infrastructure.",
    color: "#06ffa5",
    highlight: false,
    features: [
      "Unlimited agents",
      "Unlimited processes",
      "Enterprise integrations (SAP, Oracle, custom)",
      "Multi-tenant with data isolation",
      "24/7 support with guaranteed SLA",
      "Monthly Virtual CTO included",
      "Internal team training",
      "Quarterly security audit",
      "On-premise deployment available",
    ],
    cta: "Contact us for Enterprise",
    ideal: "Ideal for: companies with 50+ people",
  },
];

const FAQS = [
  {
    q: "Is there a minimum commitment?",
    a: "No. All plans are month-to-month. You can cancel with 15 days' notice, no penalty.",
  },
  {
    q: "What if I need more than 3 agents on the Professional plan?",
    a: "We move you to Enterprise or design a custom plan. Reach out and we'll figure it out together.",
  },
  {
    q: "Does the price include the agent's initial development?",
    a: "Yes. Onboarding, setup, and go-live for the agent are included in the first month.",
  },
  {
    q: "What systems can be integrated?",
    a: "Email, Google Workspace, CRMs (HubSpot, Salesforce), ERPs, Telegram, WhatsApp Business, REST APIs. If you use something different, ask us.",
  },
  {
    q: "Does my company's data ever leave our systems?",
    a: "Never. Agents process data in your own environment or on isolated EU infrastructure. We comply with GDPR.",
  },
];

export default function PricingPageEn() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function price(base: number) {
    return annual ? Math.round(base * 0.8) : base;
  }

  return (
    <div lang="en" className="min-h-screen bg-transparent">

      {/* ── HEADER ── */}
      <section className="pt-28 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-purple-300">No commitment · No code · Live in &lt;48h</span>
          </div>
          <h1 className="font-display text-5xl font-black text-foreground mb-5 leading-tight">
            Clear pricing,<br />
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              measurable results.
            </span>
          </h1>
          <p className="text-muted-foreground text-xl leading-relaxed">
            Every plan includes development, deployment, and support.
            You&apos;re not paying for consulting hours — you&apos;re paying for an agent that works.
          </p>

          {/* Monthly/annual toggle */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className={`text-sm font-semibold transition ${!annual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(a => !a)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-purple-600" : "bg-muted"}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${annual ? "left-6.5" : "left-0.5"}`}
                style={{ left: annual ? "26px" : "2px" }}
              />
            </button>
            <span className={`text-sm font-semibold transition ${annual ? "text-foreground" : "text-muted-foreground"}`}>
              Annual
              <span className="ml-2 text-xs text-green-400 font-bold">−20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-8 flex flex-col transition-all ${
                plan.highlight
                  ? "border-cyan-500/50 bg-card shadow-[0_0_40px_rgba(0,212,255,0.12)]"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-xs font-bold px-4 py-1.5 rounded-full" style={{ color: "#fff" }}>
                    Most popular
                  </span>
                </div>
              )}

              {/* Color top bar */}
              <div
                className="h-0.5 rounded-full mb-6"
                style={{ background: `linear-gradient(90deg, ${plan.color}, ${plan.color}40, transparent)` }}
              />

              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: plan.color }}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-3">
                  <span className="font-display text-5xl font-black text-foreground">
                    €{price(plan.price).toLocaleString("en-US")}
                  </span>
                  <span className="text-muted-foreground text-sm pb-2">/mo</span>
                </div>
                {annual && (
                  <p className="text-xs text-green-400 font-semibold mb-3">
                    You save €{((plan.price - price(plan.price)) * 12).toLocaleString("en-US")}/year
                  </p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">{plan.desc}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <Link
                  href={`/contact?plan=${plan.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
                  style={
                    plan.highlight
                      ? { background: "linear-gradient(135deg, #7c3aed, #00d4ff)", color: "white" }
                      : { border: `1.5px solid ${plan.color}40`, color: plan.color, background: `${plan.color}10` }
                  }
                >
                  {plan.cta} <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="text-center text-xs text-muted-foreground">{plan.ideal}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Kit Digital note — Spain-only government subsidy, kept as-is */}
        <div className="max-w-3xl mx-auto mt-10 p-5 rounded-xl border border-green-500/20 bg-green-500/5 flex items-start gap-3">
          <Zap className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            <span className="font-semibold text-green-400">Kit Digital available (Spain).</span>{" "}
            If your company has between 0 and 49 employees and operates in Spain, you can fund your AI
            agent rollout with the Kit Digital government voucher (up to €12,000). Ask us how to apply, no red tape.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-muted overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground hover:text-purple-300 transition"
                >
                  {faq.q}
                  <span className={`text-lg text-muted-foreground transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-6 border-t border-purple-500/15">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Not sure which plan you need?
          </h2>
          <p className="text-muted-foreground mb-8">
            In 15 minutes we&apos;ll tell you which process to automate first, which agent fits, and how much you&apos;d save. No commitment.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl shimmer-btn font-semibold text-white transition-transform hover:scale-105"
          >
            <MessageSquare className="h-5 w-5" />
            Book a free diagnostic
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">Response within 2 hours · No card required</p>
        </div>
      </section>

    </div>
  );
}

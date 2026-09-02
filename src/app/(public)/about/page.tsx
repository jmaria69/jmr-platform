import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bot, Cpu, Shield } from 'lucide-react';
import { PraxiaLabLogo } from '@/components/praxia-lab-logo';

export const metadata: Metadata = {
  title: 'About',
  description: "We're an AI automation studio for SMBs. We design, build, and maintain agents that run real processes in your business.",
  alternates: {
    canonical: '/about',
    languages: { es: '/acerca-de', 'x-default': '/acerca-de' },
  },
};

const values = [
  {
    icon: Bot,
    title: 'Results before technology',
    description: "We don't sell AI because it's trendy. We use it when it solves a concrete, measurable problem in your business.",
  },
  {
    icon: Shield,
    title: 'Real support',
    description: 'We respond in under 2 hours, during business hours. No first-line bots, no tickets that sit for days.',
  },
  {
    icon: Cpu,
    title: 'No code for the client',
    description: 'You describe the process. We build it, test it, and maintain it. No technical training required.',
  },
];

export default function AboutPage() {
  return (
    <div lang="en" className="min-h-screen bg-transparent text-[#e8e8f0]">
      <div className="max-w-4xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <PraxiaLabLogo size={48} />
            <div>
              <h1 className="text-2xl font-black text-white">Praxia Labs</h1>
              <p className="text-sm text-gray-400">Madrid, Spain</p>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mb-6 leading-tight">
            We automate the processes<br />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              you&apos;re still doing by hand.
            </span>
          </h2>

          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
            We&apos;re a specialized AI automation studio for small and medium businesses. We design, build, and maintain intelligent agents that run real processes in your company: invoicing, approvals, customer follow-up, report generation.
          </p>

          <p className="text-sm text-gray-500 mt-4">
            <Link href="/acerca-de" className="text-cyan-400 hover:underline">Versión en español</Link>
          </p>
        </div>

        {/* Why we exist */}
        <div className="mb-16 p-8 rounded-2xl border border-purple-500/20 glass">
          <h3 className="text-2xl font-bold text-white mb-4">Why we exist</h3>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Most automation software is built for large enterprises with dedicated IT teams. SMBs get left out, or end up paying for tools nobody knows how to configure.
            </p>
            <p>
              Praxia Labs exists to change that. We work directly with the person who owns the process — no middlemen, no 200-page manuals — and we ship automations that work from day one.
            </p>
            <p>
              Our way of working is simple: we listen, design, build, and stay with you for as long as it takes. If something breaks at 3am, we know before you do.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8">How we work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="p-6 rounded-2xl border border-purple-500/20 glass hover:border-purple-500/40 transition">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-purple-400" />
                </div>
                <h4 className="font-bold text-white mb-2">{title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div className="mb-16 p-8 rounded-2xl border border-cyan-500/20 glass">
          <h3 className="text-2xl font-bold text-white mb-4">Tech stack</h3>
          <p className="text-gray-400 mb-6">
            We use modern, well-tested tools. No reinventing the wheel.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Next.js', 'React', 'TypeScript', 'Python', 'FastAPI', 'Claude API', 'PostgreSQL', 'Docker', 'Vercel', 'LangChain', 'Resend', 'Prisma'].map(tech => (
              <span key={tech} className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-10 rounded-2xl border border-purple-500/30 glass-strong">
          <h3 className="text-2xl font-bold text-white mb-3">Have a process to automate?</h3>
          <p className="text-gray-400 mb-8">
            Book a free 15-minute demo. We&apos;ll show you exactly how we&apos;d do it for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg shimmer-btn font-semibold text-white transition-transform hover:scale-105"
            >
              Book free demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/proyectos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-cyan-500/30 text-cyan-400 font-semibold hover:bg-cyan-500/10 transition"
            >
              View projects →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

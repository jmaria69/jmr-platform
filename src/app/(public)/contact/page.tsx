'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    proyecto: '',
    mensaje: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [proyectos, setProyectos] = useState<{ id: string; name: string }[]>([]);

  // Same backend as /contacto: field names (nombre, empresa, proyecto, mensaje)
  // match the /api/contact schema, only the visible copy is in English.
  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((j) => {
        const lista = Array.isArray(j?.data) ? j.data : [];
        setProyectos(lista.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })));
      })
      .catch(() => setProyectos([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string | null) => {
    if (value) {
      setFormData((prev) => ({ ...prev, proyecto: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Message sent! We will get back to you soon.');
        setFormData({
          nombre: '',
          email: '',
          empresa: '',
          proyecto: '',
          mensaje: '',
        });
      } else {
        setStatus('error');
        setMessage(data.message || 'Error sending the message');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Connection error. Please try again.');
      console.error('Form submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div lang="en" className="min-h-screen bg-transparent text-[#e8e8f0]">

      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Contact
          </h1>
          <p className="mt-3 text-gray-300 max-w-xl mx-auto">
            Tell us about your project. We reply within 24 hours.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            <Link href="/contacto" className="text-cyan-400 hover:underline">Versión en español</Link>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover">
              <CardHeader>
                <CardTitle className="text-white">Send us a message</CardTitle>
                <CardDescription>Fill in the form and we&apos;ll get in touch with you.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Name</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        placeholder="Your name"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="bg-slate-950/50 border-purple-500/30"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-slate-950/50 border-purple-500/30"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Company</Label>
                      <Input
                        id="empresa"
                        name="empresa"
                        placeholder="Your company (optional)"
                        value={formData.empresa}
                        onChange={handleChange}
                        className="bg-slate-950/50 border-purple-500/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proyecto">Project of interest</Label>
                      <Select value={formData.proyecto} onValueChange={handleSelectChange}>
                        <SelectTrigger className="bg-slate-950/50 border-purple-500/30">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {proyectos.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                          <SelectItem value="custom">Custom project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Message</Label>
                    <Textarea
                      id="mensaje"
                      name="mensaje"
                      placeholder="Tell us about your project, needs, or questions..."
                      rows={5}
                      value={formData.mensaje}
                      onChange={handleChange}
                      className="bg-slate-950/50 border-purple-500/30"
                      required
                    />
                  </div>

                  {message && (
                    <div
                      className={`p-4 rounded-lg text-sm ${status === 'success'
                        ? 'bg-green-950/50 text-green-300 border border-green-500/30'
                        : 'bg-red-950/50 text-red-300 border border-red-500/30'
                        }`}
                    >
                      {message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    {loading ? 'Sending...' : 'Send message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-lg bg-purple-600/20 p-3">
                  <Mail className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <a
                    href="mailto:jmaria.romero@praxialabs.com"
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    jmaria.romero@praxialabs.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-lg bg-cyan-600/20 p-3">
                  <Phone className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Phone</p>
                  <a href="tel:+34655792350" className="text-sm text-cyan-400 hover:text-cyan-300">
                    +34 655 792 350
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-lg bg-violet-600/20 p-3">
                  <MapPin className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Location</p>
                  <p className="text-sm text-gray-400">Madrid, Spain</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover">
              <CardContent className="p-5">
                <p className="text-sm font-semibold mb-2">Business hours</p>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>Monday - Friday: 9:00 - 19:00 (CET)</p>
                  <p>Saturdays: 10:00 - 14:00 (CET)</p>
                  <p>Sundays: Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

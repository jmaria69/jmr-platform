"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

export function AnalyticsAnalysis() {
    const [analysis, setAnalysis] = useState("");
    const [loading, setLoading] = useState(false);

    const analyzeData = async () => {
        setLoading(true);
        try {
            const analyticsData = {
                visitas_mes: 1250,
                usuarios_unicos: 340,
                demos_vistas: 89,
                tasa_rebote: 32,
                duracion_promedio: "3m 45s",
                dispositivos: { desktop: 65, mobile: 30, tablet: 5 },
                fuentes_trafico: { organico: 45, directo: 30, referral: 15, social: 10 },
            };

            const res = await fetch("/api/analytics/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ analyticsData }),
            });

            const data = await res.json();
            setAnalysis(data.analysis || "Error en el análisis");
        } catch (error) {
            setAnalysis("Error: " + String(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    Análisis IA
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={analyzeData} disabled={loading} className="w-full gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {loading ? "Analizando..." : "Analizar datos"}
                </Button>
                {analysis && <div className="bg-slate-900/50 p-4 rounded-lg text-sm text-slate-300">{analysis}</div>}
            </CardContent>
        </Card>
    );
}
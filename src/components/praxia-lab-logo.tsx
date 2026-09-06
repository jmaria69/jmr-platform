"use client";

export function PraxiaLabLogo({ size = 36 }: { size?: number }) {
    return (
        <span style={{ width: size, height: size, display: "inline-flex" }}>
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="al-go" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="var(--logo-gradient-stop-0)" />
                    <stop offset="50%" stopColor="var(--logo-gradient-stop-50)" />
                    <stop offset="100%" stopColor="var(--logo-gradient-stop-100)" />
                </linearGradient>
                <filter id="al-fc"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="var(--logo-filter-fc)" floodOpacity="1" /></filter>
                <filter id="al-fp"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="var(--logo-filter-fp)" floodOpacity="1" /></filter>
                <filter id="al-fv"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="var(--logo-filter-fv)" floodOpacity="1" /></filter>
                <filter id="al-fg"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="var(--logo-filter-fg)" floodOpacity="1" /></filter>
                <filter id="al-core"><feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="var(--logo-filter-core)" floodOpacity="0.9" /></filter>
            </defs>
            {/* Fondo "chip": transparente en tema oscuro, sólido en tema marfil (--logo-backdrop
                en globals.css). El neón está pensado para verse sobre fondo oscuro, así que en
                el tema claro le damos ese fondo oscuro propio en vez de depender del de la página
                (un halo puesto por CSS con z-index detrás del span quedaba oculto tras el fondo
                del propio header/footer en vez de detrás solo del logo). */}
            <circle cx="36" cy="36" r="35" fill="var(--logo-backdrop)" />
            {/* Orbit rings */}
            <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go)" strokeWidth="1.3" fill="none" opacity="0.45" />
            <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go)" strokeWidth="1.3" fill="none" opacity="0.45" transform="rotate(60 36 36)" />
            <ellipse cx="36" cy="36" rx="34" ry="11" stroke="url(#al-go)" strokeWidth="1.3" fill="none" opacity="0.45" transform="rotate(120 36 36)" />
            {/* Nucleus */}
            <circle cx="36" cy="36" r="5.5" fill="url(#al-go)" filter="url(#al-core)" />
            <circle cx="36" cy="36" r="2.5" fill="var(--logo-nucleus-center)" fillOpacity={0.95} />
            {/* Orbit 1 — cyan */}
            <circle fill="var(--logo-electron-1)" filter="url(#al-fc)">
                <animate attributeName="cx" dur="5s" repeatCount="indefinite" calcMode="linear" values="70;60;36;12;2;12;36;60;70" />
                <animate attributeName="cy" dur="5s" repeatCount="indefinite" calcMode="linear" values="36;44;47;44;36;28;25;28;36" />
                <animate attributeName="r" dur="2.1s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
            </circle>
            <circle fill="var(--logo-electron-1)" filter="url(#al-fc)" opacity="0.85">
                <animate attributeName="cx" dur="5s" begin="-2.5s" repeatCount="indefinite" calcMode="linear" values="70;60;36;12;2;12;36;60;70" />
                <animate attributeName="cy" dur="5s" begin="-2.5s" repeatCount="indefinite" calcMode="linear" values="36;44;47;44;36;28;25;28;36" />
                <animate attributeName="r" dur="1.7s" begin="-0.9s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
            </circle>
            {/* Orbit 2 — pink */}
            <circle fill="#f472b6" filter="url(#al-fp)">
                <animate attributeName="cx" dur="7s" repeatCount="indefinite" calcMode="linear" values="53;41;27;17;19;31;46;55;53" />
                <animate attributeName="cy" dur="7s" repeatCount="indefinite" calcMode="linear" values="65;61;42;19;7;11;31;53;65" />
                <animate attributeName="r" dur="2.5s" begin="-0.5s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
            </circle>
            <circle fill="var(--logo-electron-2)" filter="url(#al-fp)" opacity="0.85">
                <animate attributeName="cx" dur="7s" begin="-3.5s" repeatCount="indefinite" calcMode="linear" values="53;41;27;17;19;31;46;55;53" />
                <animate attributeName="cy" dur="7s" begin="-3.5s" repeatCount="indefinite" calcMode="linear" values="65;61;42;19;7;11;31;53;65" />
                <animate attributeName="r" dur="1.9s" begin="-1.2s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
            </circle>
            {/* Orbit 3 — violet + emerald */}
            <circle fill="var(--logo-electron-3a)" filter="url(#al-fv)">
                <animate attributeName="cx" dur="6s" repeatCount="indefinite" calcMode="linear" values="19;17;27;41;53;55;46;31;19" />
                <animate attributeName="cy" dur="6s" repeatCount="indefinite" calcMode="linear" values="65;53;31;11;7;19;42;61;65" />
                <animate attributeName="r" dur="2.3s" begin="-1.1s" repeatCount="indefinite" values="2.4;4.2;2.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
            </circle>
            <circle fill="var(--logo-electron-3b)" filter="url(#al-fg)" opacity="0.9">
                <animate attributeName="cx" dur="6s" begin="-3s" repeatCount="indefinite" calcMode="linear" values="19;17;27;41;53;55;46;31;19" />
                <animate attributeName="cy" dur="6s" begin="-3s" repeatCount="indefinite" calcMode="linear" values="65;53;31;11;7;19;42;61;65" />
                <animate attributeName="r" dur="2.0s" begin="-0.3s" repeatCount="indefinite" values="1.4;3.1;1.4" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
            </circle>
        </svg>
        </span>
    );
}
import React from "react";

export const StructuredData: React.FC = () => {
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://praxialabs.com/#organization",
        "name": "Praxia Labs",
        "url": "https://praxialabs.com",
        "logo": "https://praxialabs.com/icon.svg",
        "description": "Laboratorio de Inteligencia Artificial aplicada y Ciberseguridad Activa. Automatización de operaciones empresariales con agentes autónomos, extracción de facturas y plataforma de defensa SIAM.",
        "email": "contacto@praxialabs.com",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "ES"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Spain"
        },
        "knowsAbout": [
          "Inteligencia Artificial para Empresas",
          "Automatización de Facturas con IA",
          "Ciberseguridad Activa y WAF",
          "Honeypots y Detección de Amenazas",
          "Agentes Autónomos de Back-office",
          "Modelos Locales Soberanos AirGap",
          "Cumplimiento NIS2"
        ],
        "sameAs": [
          "https://www.linkedin.com/company/130074338/",
          "https://praxialabs.com"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://praxialabs.com/#siam",
        "name": "SIAM - Sistema Inteligente de Autodefensa y Monitorización",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Linux, Cloud, On-Premise",
        "url": "https://praxialabs.com/siam",
        "description": "Plataforma de ciberseguridad activa para PYMEs. Bloqueo perimetral en milisegundos (WAF), señuelos trampa (Honeypot) para perfilado de atacantes y análisis forense automatizado alineado con MITRE ATT&CK.",
        "featureList": [
          "WAF de bloqueo perimetral en tiempo real",
          "Honeypot de alta interacción con captura de payloads",
          "Reconstrucción forense de Kill-Chain con MITRE ATT&CK",
          "Dashboard SOC interactivo 24/7",
          "Alertas de incidentes con recomendación de contención inmediata"
        ],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "description": "Diagnóstico inicial y demo activa sin compromiso"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://praxialabs.com/#coreops",
        "name": "Praxia Core-Ops & Invoices AI",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Cloud, AirGap Local",
        "url": "https://praxialabs.com/core-ops",
        "description": "Agente autónomo de extracción, conciliación y contabilización de facturas en menos de 3 segundos con 99.4% de precisión, sin plantillas rígidas.",
        "featureList": [
          "Extracción OCR y visión multimodal para facturas PDF y tickets",
          "Validación contable automática contra NIFs y bases imponibles",
          "Integración bidireccional con ERP y hojas de cálculo",
          "Modo AirGap Local Galaxy para privacidad total"
        ],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "description": "Piloto de 48 horas en entorno de pruebas"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://praxialabs.com/#adminapp",
        "name": "AdminApp — Gestión Inteligente de Fincas y Comunidades",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Cloud, WhatsApp Bot",
        "url": "https://praxialabs.com/adminapp",
        "description": "Plataforma de IA para administradores de fincas. Atención a vecinos 24/7 vía WhatsApp, gestión automática de incidencias y conciliación bancaria de derramas.",
        "featureList": [
          "Atención y triaje autónomo de vecinos vía WhatsApp 24/7 con agente VERA",
          "Generación de partes de seguro e incidencias con proveedores en segundos",
          "Conciliación bancaria de recibos comunitarios y control de morosidad",
          "Auditoría y trazabilidad completa de acuerdos de juntas"
        ],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "description": "Demostración guiada y piloto para despachos profesionales"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://praxialabs.com/#website",
        "url": "https://praxialabs.com",
        "name": "Praxia Labs",
        "description": "Automatización con IA para empresas, extracción de facturas y Ciberseguridad Activa",
        "publisher": {
          "@id": "https://praxialabs.com/#organization"
        },
        "inLanguage": "es-ES"
      },
      {
        "@type": "FAQPage",
        "@id": "https://praxialabs.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Cómo automatizar la gestión y extracción de facturas con IA en mi empresa?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Praxia Labs despliega agentes de visión multimodal y LLMs capaces de procesar facturas en PDF o imagen en 3 segundos con un 99.4% de precisión. El sistema extrae emisor, NIF, líneas de desglose, bases imponibles e impuestos, y los valida directamente contra tu ERP o sistema de gestión sin requerir plantillas fijas."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué es SIAM y cómo defiende a las empresas frente a ciberataques?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SIAM (Sistema Inteligente de Autodefensa y Monitorización) es una solución de seguridad activa que integra un WAF de bloqueo perimetral instantáneo, trampas Honeypot señuelo para registrar el comportamiento de atacantes y un motor forense de Kill-Chain que clasifica las amenazas según la matriz MITRE ATT&CK."
            }
          },
          {
            "@type": "Question",
            "name": "¿Es posible utilizar IA para procesar datos confidenciales sin enviarlos a la nube pública?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí. Mediante Praxia AirGap AI y Local Galaxy, los modelos de lenguaje y visión se despliegan de forma soberana en servidores propios on-premise, cumpliendo estrictamente con el RGPD, la directiva NIS2 y garantizando que ningún dato abandone las instalaciones de la empresa."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaGraph)
      }}
    />
  );
};

export default StructuredData;
import type { Metadata } from 'next'

export const StructuredData: React.FC = () => {
  const data: Metadata = {
    // This is just to satisfy the type; we will output a script tag directly.
  }

  // We'll use dangerouslySetInnerHTML? Better to just return a script tag with the JSON.
  // Since we are in a client component? We'll make it a server component by default.
  // Next.js allows to put JSON-LD in a server component.
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Praxia Labs",
    "image": [
      "/icon-light.svg",
      "/icon.svg"
    ],
    "@id": "https://praxialabs.com/#localbusiness",
    "url": "https://praxialabs.com/",
    "telephone": "+34 910 000 000",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle de Example 123",
      "addressLocality": "Madrid",
      "postalCode": "28001",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.4168,
      "longitude": -3.7038
    },
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }],
    "sameAs": [
      "https://www.facebook.com/praxialabs",
      "https://twitter.com/praxialabs",
      "https://www.linkedin.com/company/praxialabs",
      "https://www.instagram.com/praxialabs/"
    ]
  }

  return (
    <script
      type="application/ld+json"
      // Using dangerouslySetInnerHTML to avoid Next.js escaping the JSON.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(ldJson, null, 2)
      }}
    />
  )
}

export default StructuredData
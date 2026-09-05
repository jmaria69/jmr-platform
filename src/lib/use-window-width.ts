'use client';

import { useEffect, useState } from 'react'

export function useWindowWidth() {
  // Siempre arranca en 0 tanto en servidor como en el primer render del cliente:
  // si leyéramos window.innerWidth aquí, el primer render del cliente (antes de
  // montar) no coincidiría con el HTML del servidor y React lanzaría un error
  // de hidratación. El valor real se aplica en el efecto, tras el montaje.
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}
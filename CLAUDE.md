# Praxia Labs - Sesión 28 Mayo 2026

## ✅ COMPLETADO ESTA SESIÓN

### Autenticación & Middleware

- ✅ Middleware creado en `src/middleware.ts` con JWT validation
- ✅ Login en `src/app/login/page.tsx` con botón "Volver a Home"
- ✅ Sesión usando `lib/auth/session.ts` con `jmr_session` cookie
- ✅ `AUTH_SECRET` configurado en `.env.local`

### Dashboard & Rutas

- ✅ `/dashboard/demo` → Datos mock/seed (sin login)
- ✅ `/admin/dashboard` → Datos reales GA (con login)
- ✅ `/admin/demo` → Demo con navegación admin (excluido del middleware)
- ✅ Home con `DashboardLink` que detecta sesión:
  - Logueado → `/admin/dashboard`
  - Sin login → `/admin/demo`

### Proyectos

- ✅ `src/lib/projects.ts` actualizado con 13 proyectos + URLs correctas:
  - OLGA.ai: <https://694de94d9c69f2c5-188-26-209-26.serveousercontent.com/dashboard>
  - AdminApp: <https://adminapp-maestro.vercel.app/presentation>
  - Core OPS: <https://core-ops-eight.vercel.app/>
  - InmoTech: <https://landing-inmobiliaria-tau.vercel.app/>
  - Otros 9 proyectos en producción + 2 en beta
- ✅ `scripts/seed.dev.ts` actualizado para crear todos los proyectos en BD
- ✅ `src/lib/repositories/projects.repository.ts` con fallback a seed si BD vacía
- ✅ Página `/proyectos/[id]` con badge "En preproducción" para proyectos sin URL

### Admin Panel Seguridad

- ✅ `src/app/api/security/alert/route.ts` creado con:
  - POST: Registra eventos de ataque
  - GET: Lee eventos (con autenticación)
  - PATCH: Marca como resuelto (con autenticación)
  - Validación de `SECURITY_SECRET` en todos los endpoints
  - Persistencia en Vercel Blob
  - Email alerts vía EmailJS
  - Rate limiting por IP con escalado de severidad
- ✅ `src/components/admin/admin-sidebar.tsx` con lógica de demo:
  - Si `/admin/demo` → No muestra botón "Cerrar sesión"
  - Muestra "Demo" en lugar de "Admin Panel"

### Base de Datos

- ✅ Seed ejecutado: 13 proyectos + 6 CRM contacts + 11 interactions
- ✅ Admins creados: <admin@test.com>, <jmaria.romero@praxialabs.com>

## 🔴 TODO MAÑANA (PRIORITARIO)

### 1. CONFIGURAR EMAILJS PARA SEGURIDAD

**Archivo**: `src/app/api/security/alert/route.ts`
**Qué falta**: Las credenciales de EmailJS en `.env.local` y Vercel

```env
EMAILJS_PUBLIC_KEY=tu_public_key
EMAILJS_PRIVATE_KEY=tu_private_key
EMAILJS_SERVICE_ID=tu_service_id
EMAILJS_SECURITY_TEMPLATE=tu_template_id
```

**Pasos**:

1. Ve a <https://emailjs.com/>
2. Crea una cuenta/login
3. Copia las credenciales
4. Añade a `.env.local`
5. Crea template en EmailJS con las variables que espera el código:
   - severidad, tipo_ataque, ip_atacante, ruta, user_agent, fecha_hora, detalles, solucion, total_eventos, panel_url, to_email

### 2. INTEGRAR EVENTOS DE SEGURIDAD EN LOGIN FALLIDO

**Archivo**: `src/app/actions/auth.ts`
**Qué hacer**: Cuando `passwordValid === false`, enviar evento al endpoint `/api/security/alert`

```typescript
// En la función login(), cuando falla:
if (!passwordValid) {
  // Registrar intento fallido
  await fetch('/api/security/alert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-security-secret': process.env.SECURITY_SECRET || '',
    },
    body: JSON.stringify({
      type: 'brute_force',
      ip: request.ip || 'unknown',
      path: '/admin/login',
      userAgent: request.headers.get('user-agent') || '',
      severity: 'medium',
      details: `Intento fallido de login: ${email}`,
    }),
  });
  return { error: "Credenciales inválidas" };
}
```

### 3. VERIFICAR QUE ADMIN/SEGURIDAD LEE LOS EVENTOS

**Archivo**: `src/app/admin/seguridad/page.tsx`
**Qué hacer**:

- Verificar que fetchea de `/api/security/alert?limit=50` con header `x-security-secret`
- Que muestre los eventos en tiempo real
- Que tenga botones para marcar como resuelto (PATCH)

### 4. DEPLOYAR A VERCEL

**Pasos**:

1. Añadir variables de entorno en Vercel Settings:

```
NEXT_PUBLIC_SITE_URL=https://praxialabs.com
SECURITY_SECRET=(el que generaste)
SECURITY_ALERT_EMAIL=jmaria.romero@praxialabs.com
EMAILJS_*=credenciales
BLOB_READ_WRITE_TOKEN=(si usas Vercel Blob)
```

2. `git push` → Auto-deploy en Vercel
2. Verificar que `/admin/seguridad` funciona en producción

---

## 📋 ESTADO ACTUAL DEL PROYECTO

### Stack

- Next.js 16.2.6, React 19.2.4, TypeScript, Tailwind 4, shadcn/ui
- Backend: Next.js API routes, Prisma v5.22.0
- DB: PostgreSQL (Neon)
- Auth: JWT + bcryptjs (jmr_session cookie)
- Seguridad: EmailJS alerts + Vercel Blob storage
- Hosting: Vercel

### URLs Clave

- Local: <http://localhost:3001>
- Producción: <https://praxialabs.com>
- Admin: /admin/dashboard (protegido)
- Demo: /admin/demo (público)
- Seguridad: /admin/seguridad (protegido)
- Proyectos: /proyectos (público)

### Credenciales Dev

- Email: <admin@test.com> | <jmaria.romero@praxialabs.com>
- Password: TxAJvAPT^WJ*xw8J
- JWT_SECRET: AUTH_SECRET en .env.local
- SECURITY_SECRET: Generado (32 chars hex)

### Variables de Entorno Críticas

```
.env.local:
- AUTH_SECRET=...
- DATABASE_URL=postgresql://...
- ADMIN_PASSWORD=TxAJvAPT^WJ*xw8J
- SECURITY_SECRET=...
- NEXT_PUBLIC_SITE_URL=http://localhost:3001
- EMAILJS_PUBLIC_KEY=...
- EMAILJS_PRIVATE_KEY=...
- EMAILJS_SERVICE_ID=...
- EMAILJS_SECURITY_TEMPLATE=...
```

### Archivos Clave Modificados

- `src/middleware.ts` - JWT validation
- `src/app/login/page.tsx` - Login con botón volver
- `src/components/dashboard-link.tsx` - Detecta sesión
- `src/components/admin/admin-sidebar.tsx` - Demo mode
- `src/lib/projects.ts` - 13 proyectos actualizados
- `scripts/seed.dev.ts` - Seed con proyectos reales
- `src/lib/repositories/projects.repository.ts` - Fallback a seed
- `src/app/api/security/alert/route.ts` - Endpoint de seguridad

---

## 🎯 PRÓXIMAS SESIONES (POST-MAÑANA)

1. **Analytics Integration**: Datos reales de Google Analytics en dashboard
2. **CRM Pipeline**: Visualización de contacts con estados
3. **Marketing Insights**: ROI tracking y métricas de monetización
4. **Mobile Optimization**: Responsive design en admin panel
5. **Deployment Checks**: Verificar todo funciona en praxialabs.com

---

## 📝 NOTAS IMPORTANTES

- El demo nunca va a producción: siempre seed data
- Admin dashboard intenta GA real, pero fallback a seed si no hay datos
- Seguridad: Todos los endpoints POST/GET/PATCH requieren header `x-security-secret`
- Rate limiting: Por IP, persiste en Blob, escalado de severidad automático
- Email alerts: Cooldown de 5 minutos entre emails (en memoria, mejor en BD)
- Blob storage: Guarda eventos indefinidamente (200 eventos max en memoria)

---

**Generado**: 29 Mayo 2026, 20:30 CET
**Última sesión**: Autenticación, Proyectos, Seguridad
**Próximo foco**: EmailJS + Integración de eventos de login fallido

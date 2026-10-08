# adoptr-front

Interfaz web de Adoptr con Next.js App Router. Leer [AGENT.md](AGENT.md), [arquitectura y prioridades técnicas](docs/arquitectura/lineamientos.md) e [integración con la API](docs/arquitectura/integracion.md) antes de agregar funcionalidades.

## Desarrollo local

Requisitos: Node.js compatible con Next.js 16, npm y backend accesible con PostgreSQL y claves Google disponibles. La URL de la API se configura mediante `API_URL`, solo del lado servidor. Para el botón Google se necesita un Client ID de Google Identity Services autorizado para `http://localhost:3000`:

```bash
# Crear .env.local (ignorado por git) y completar:
API_URL=http://localhost:8081
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<tu-client-id-de-Google>
```

El Client ID es público; **no** colocar secretos de cliente ni JWT allí. El backend aún no valida el audience del ID token: no considerar seguro el login para producción. Ver [integración](docs/arquitectura/integracion.md).

```bash
npm ci
npm run dev
# abrir http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build
```

Verificar la política de cookie `secure` en HTTP de desarrollo y HTTPS de despliegue; no asumir persistencia ni autorización por la sola presencia de la cookie. Para ejecutar la API ver también `../adoptr-back/README.md`.

- Arquitectura y prioridades: [lineamientos](docs/arquitectura/lineamientos.md) · [integración](docs/arquitectura/integracion.md)
- Producto: [flujos y decisiones abiertas](docs/producto/flujos-producto.md)

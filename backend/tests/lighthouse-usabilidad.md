# Guía: Pruebas de Usabilidad con Lighthouse CLI

## Prerrequisitos
```powershell
npm install -g lighthouse
```

## Comandos de ejecución (con la app corriendo en localhost:5173)

### LH-01: Página de Inicio (Landing Page)
```powershell
lighthouse http://localhost:5173 --output=json --output=html --output-path=./tests/resultados/lh-landing --locale=es --only-categories=accessibility,best-practices,performance,seo
```

### LH-02: Página de Catálogo / Marketplace
```powershell
lighthouse http://localhost:5173/marketplace --output=json --output=html --output-path=./tests/resultados/lh-marketplace --locale=es
```

### LH-03: Página de Login
```powershell
lighthouse http://localhost:5173/login --output=json --output=html --output-path=./tests/resultados/lh-login --locale=es
```

### LH-04: Página de Registro
```powershell
lighthouse http://localhost:5173/registro --output=json --output=html --output-path=./tests/resultados/lh-registro --locale=es
```

## Métricas clave a reportar (ISO 25010 — Usabilidad)
- Performance Score (0-100)
- Accessibility Score (0-100)
- Best Practices Score (0-100)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

## Umbrales de aceptación
| Categoría         | Mínimo Aceptable | Objetivo |
|-------------------|-----------------|----------|
| Performance       | ≥ 50            | ≥ 75     |
| Accessibility     | ≥ 70            | ≥ 90     |
| Best Practices    | ≥ 75            | ≥ 90     |
| SEO               | ≥ 70            | ≥ 85     |

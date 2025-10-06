# Guía de Desarrollo

## Requisitos Previos

Por definir según la tecnología elegida. Ejemplo:
- Node.js (v14 o superior)
- npm o yarn
- Git

## Configuración del Entorno de Desarrollo

### 1. Clonar el Repositorio

```bash
git clone https://github.com/JuanSeRestrepoNieto/CalendarioLocal.git
cd CalendarioLocal
```

### 2. Instalar Dependencias

```bash
# Por definir
npm install
# o
yarn install
```

### 3. Configuración

```bash
# Copiar archivo de configuración de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones locales
```

## Estructura del Proyecto

```
CalendarioLocal/
├── docs/               # Documentación
├── src/                # Código fuente
│   ├── components/     # Componentes reutilizables
│   ├── utils/          # Utilidades y helpers
│   ├── models/         # Modelos de datos
│   └── services/       # Servicios y lógica de negocio
├── tests/              # Pruebas
│   ├── unit/           # Pruebas unitarias
│   └── integration/    # Pruebas de integración
└── ...
```

## Ejecutar en Modo Desarrollo

```bash
# Por definir
npm run dev
# o
yarn dev
```

## Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## Estándares de Código

- Seguir las convenciones del lenguaje utilizado
- Usar linter configurado en el proyecto
- Escribir código autodocumentado
- Agregar comentarios cuando sea necesario

## Proceso de Desarrollo

1. Crear una rama desde `main` para tu feature/fix
2. Desarrollar los cambios
3. Escribir/actualizar pruebas
4. Ejecutar pruebas localmente
5. Commit con mensajes descriptivos
6. Push y crear Pull Request
7. Esperar revisión del código

## Herramientas Recomendadas

- Editor: VS Code, Sublime Text, Atom
- Control de versiones: Git
- Terminal: bash, zsh, PowerShell

## Debugging

Por definir según la tecnología elegida.

## Comandos Útiles

```bash
# Limpiar dependencias y reinstalar
npm clean-install

# Verificar código con linter
npm run lint

# Formatear código
npm run format
```

## Recursos Adicionales

- [Documentación oficial](docs/README.md)
- [Guía de contribución](../CONTRIBUTING.md)

# Gastos App — Gestor Financiero

[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-orange)](https://github.com/pmndrs/zustand)

Una aplicación premium y moderna de seguimiento de gastos financieros construida con **React Native** y **Expo**. Gestiona tu presupuesto, rastrea categorías y visualiza tu flujo de caja con facilidad.

---

## Características

- **Dashboard Premium**: Resumen de tu saldo, ingresos mensuales y gastos.
- **Visualización de Flujo de Caja**: Gráficos dinámicos para entender tus patrones de gasto.
- **Seguimiento por Categorías**: Organiza tus gastos en categorías personalizadas.
- **Actividad Reciente**: Acceso rápido a tus últimas transacciones.
- **Autenticación Segura**: Flujos de inicio de sesión y autenticación integrados.
- **Modo Oscuro**: Estética oscura elegante diseñada para una mejor experiencia de usuario.

---

## Stack Tecnológico

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Base de Datos y Auth**: [Supabase](https://supabase.com/)
- **Gestión de Estado**: [Zustand](https://github.com/pmndrs/zustand)
- **Peticiones de Datos**: [React Query](https://tanstack.com/query/latest)
- **Navegación**: [Expo Router](https://docs.expo.dev/router/introduction/) (Basado en archivos)
- **Animaciones**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

## Comienzo

### Requisitos Previos

- [Node.js](https://nodejs.org/)
- [Expo Go](https://expo.dev/go) en tu dispositivo móvil O Emulador de Android/iOS

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/App_Gastos_RN.git
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   Crea un archivo `.env` en el directorio raíz y añade tus credenciales de Supabase:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=tu_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npx expo start
   ```

---

## Estructura del Proyecto

```text
├── app/               # Páginas de Expo Router (tabs, auth, etc.)
├── components/        # Componentes de UI reutilizables
├── constants/         # Constantes de la app (Colores, Tipografía)
├── hooks/             # Hooks de React personalizados
├── src/               # Lógica central de la aplicación
│   ├── components/    # Componentes específicos de funciones
│   └── hooks/         # Hooks específicos de funciones
└── assets/            # Activos estáticos (imágenes, fuentes)
```

---
Hecho con ❤️ por Aldo Garcia

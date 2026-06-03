# Home Services Marketplace

*¿Qué cambiarías en tu solución si este componente lo fueran a usar tres personas distintas del equipo en contextos diferentes?*

Para esta prueba opté por una solución basada en una prop variant, ya que solo existen dos contextos claramente definidos y permite mantener la implementación simple y fácil de entender. Si el componente comenzara a ser utilizado en más escenarios por distintos desarrolladores, consideraría migrar hacia un enfoque basado en composición, similar al utilizado por bibliotecas como Shadcn UI, para mejorar la escalabilidad, reutilización y mantenibilidad del código.

## Clone

```bash
git clone https://github.com/ibrahimhc19/pruebaTecnica.git
cd pruebaTecnica
```

## Run

```bash
npm install
npx expo start
```

Una vez que el servidor de Expo se inicie, presiona:
- **`a`** — abrir en Android
- **`i`** — abrir en iOS
- **`w`** — abrir en web

O puedes lanzar directamente a una plataforma:

```bash
npm run android
npm run ios
npm run web
```

## Scripts

| Command              | Description                |
| -------------------- | -------------------------- |
| `npm install`        | Install dependencies        |
| `npx expo start`     | Start Expo dev server       |
| `npm run android`    | Start on Android            |
| `npm run ios`        | Start on iOS                |
| `npm run web`        | Start on web                |
| `npm run lint`       | Run linter                  |
| `npm run typecheck`  | Run TypeScript check        |

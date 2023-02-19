```
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ expo
  |   ├─ Expo SDK 48
  |   ├─ React Native using React 18
  |   ├─ Navigation using Expo Router
  |   ├─ Tailwind using Nativewind
  |   └─ Typesafe API calls using tRPC
  └─ next.js
      ├─ Next.js 13
      ├─ React 18
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
 ├─ api
 |   └─ tRPC v10 router definition
 ├─ auth
     └─ authentication using next-auth. **NOTE: Only for Next.js app, not Expo**
 └─ db
     └─ typesafe db-calls using Kysely
```

## Quick Start

To get it running, follow the steps below:

### Setup dependencies

```
1. Node version
v19.6.0

2. Install dependencies
pnpm i

3. Configure environment variables. There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

4. Start Mysql Server
mysql.server start

5. Generate Kysely Models from Mysql
pnpm kysely-codegen

6. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator/).

7. Run at the project root folder.
pnpm dev

(Optional) It might be easier to run each app in separate terminal windows so you get the logs from each app separately
pnpm --filter expo dev
pnpm --filter nextjs dev
```

### Setup IDE
```
1. Download Webstorm 2022.3.x

2. Download prettier pluggin for Webstorm

3. Run prettier automatically on save
https://www.jetbrains.com/help/idea/prettier.html#ws_prettier_reformat_code 
```

### Make sure that pre-commit hook is running

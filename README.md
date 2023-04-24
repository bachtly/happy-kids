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

## Deployment

### Database
MySQL is deployed in docker and the data should be mounted to server.
```
sudo docker run --name mysql -p 3306:3306 -v mysql_volume:/var/lib/mysql/ -d -e "MYSQL_ROOT_PASSWORD=temp123" mysql
```
The schema SQL script need to be run manually. Go into the docker container, open mysql shell, then paste the script
to execute.
```
sudo docker exec -it mysql /bin/sh
mysql -u root -p
```

### Expo
The target is having a pre-release version, which allow internal users (teammates, instructors) to download from a URL.
The app shoud allow updating whenever we build new version.
#### First build 
*(Note: should run at the first time. Updates should be used for following builds)*
```
pnpm install
cd apps/expo && eas build --profile preview --platform android
```
#### Updates
```
pnpm install
eas update:configure --platform android
```
Copy lines of code as the output suggests in to `app.config.ts`. Then run the following command.\
**Note: The `expo-update` package, which is added during update, should not be committed.
It will cause stack overflow when buildng the app again**
```
cd apps/expo && eas update --branch preview --message "Updating the app" --platform android
```

### Backend
**First remember to create a `.env` file inside `app/nextjs`**\
A nodejs docker is deployed to expose API for client to call. Nginx should be the web server.
Should manually install and build nextjs first, then start the service.
```
pnpm install 
sudo pnpm kysely-codegen
pnpm --filter nextjs build
sudo docker-compose start
```

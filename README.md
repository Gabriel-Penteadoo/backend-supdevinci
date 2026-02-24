<h1 align="center">NestJs cours</h1>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Role & permissions (bitmask)

The project uses a bitmask permission system (`bigint`).

- `USER_READ_PROFILE` = `1` (`1n << 0n`)
- `USER_UPDATE_PROFILE` = `2` (`1n << 1n`)
- `CONVERSATION_READ` = `4` (`1n << 2n`)
- `CONVERSATION_CREATE` = `8` (`1n << 3n`)
- `CONVERSATION_UPDATE` = `16` (`1n << 4n`)
- `CONVERSATION_DELETE` = `32` (`1n << 5n`)
- `MESSAGE_SEND` = `64` (`1n << 6n`)
- `ADMIN_MANAGE_USERS` = `128` (`1n << 7n`)

### Role presets

- `USER` mask = `127`
- `MODERATOR` mask = `127`
- `ADMIN` mask = `255`

### Postman quick usage

Use these endpoints with an admin token:

- `PUT /auth/permissions/grant`
- `PUT /auth/permissions/revoke`
- `PUT /auth/permissions/toggle`
- `PUT /auth/permissions/role`

Example body for grant/revoke/toggle:

```json
{
  "userCredentialsId": "<uuid>",
  "permission": "8"
}
```

Example body for role:

```json
{
  "userCredentialsId": "<uuid>",
  "role": "ADMIN"
}
```

## Firestore (messages)

The message module now uses Google Firestore for message storage.
Image uploads use Firebase Storage and save metadata in Firestore.

Install dependencies:

```bash
npm install
```

You can configure credentials in 2 ways:

1) Service account JSON file path (recommended for local dev)

- `FIREBASE_SERVICE_ACCOUNT_PATH`

Windows example (JSON downloaded in Downloads):

```env
FIREBASE_SERVICE_ACCOUNT_PATH=C:\\Users\\Gabriel\\Downloads\\your-service-account.json
```

2) Split env variables

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (replace line breaks with `\\n` in `.env`)

Example:

```env
FIREBASE_PROJECT_ID=my-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@my-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
```

For image upload, also set:

```env
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

Priority used by the app:

1. `FIREBASE_SERVICE_ACCOUNT_PATH`
2. split env variables
3. Application Default Credentials

### Message image upload endpoint

- `POST /message/upload-image`
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`
- Fields:
  - `conversationId` (uuid)
  - `caption` (optional)
  - `image` (file)
- Constraints:
  - max file size: `5MB`
  - allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

### Dev image test route

- `POST /dev/test-image`
- Optional header: `x-seed-key` (required if `SEED_KEY` is set)
- `Content-Type: multipart/form-data`
- Fields:
  - `image` (file)
  - `note` (optional text)

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

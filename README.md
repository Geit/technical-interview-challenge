# Vetspire Take-home

## Getting Started

1. Run `yarn` to install dependencies
1. Run `yarn start` to start up the backend & frontend.
1. By default, the backend will start on port 3000, and the frontend on port 1234.

## Features

- Backend API that serves:
  - A list of available dog breeds based on those available in `/images`
  - Individual dog images by breed
- Frontend UI that provides:
  - A list of dog breeds
  - The ability to choose a breed and display the image for it
- Bonus Feature:
  - Ability to add a new breed with a new image

## Design Decisions

For the Frontend, we have:

- A simple TypeScript React app.
- Bundled with Parcel for configless SCSS, React and TS support.
- React Router for routing.
- `use-http` for making calls to the backend.

For the Backend, we have:

- A simple TypeScript Koa App.
- `koa-router` for routing.
- `koa-body` for file uploads.
- `koa-static` for serving static assets.
- `koa-mount` for mounting `koa-static` as its own app.

We also have:

- Prettier for opinionated minimal-config formatting.
- Jest for running tests (note, tests are only stubs)
- Ultra for as a script runner.
- `packages/common` for shared types/deps etc.

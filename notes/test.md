# Testing
The current focus is strong test coverage for the Core package.

### Setup

Requirement: create from project root directory folders `/assets/cookies`, `/assets/pdfs`, and `/assets/screenshots`

### Running

Run the local test site for the included e2e tests:
```bash
npm run test:site
```

Each library (`core`, `instagram`, `linkedin`) can be tested:
```bash
nx test <library name>
```

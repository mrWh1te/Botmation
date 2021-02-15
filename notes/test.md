# Testing
The current focus is strong test coverage for the Core package.

### Running

Run the local test site for the included e2e tests to run against:
```bash
npm run test:site
```

Then, in a separate terminal, test any library `core`, `instagram`, `linkedin`:
```bash
nx test <library name>
```

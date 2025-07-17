cd packages/next-international
pnpm build
pnpm publish --no-git-checks --registry http://nexus.dev.niuchart.com:8081/repository/npm-hosted/ --tag latest
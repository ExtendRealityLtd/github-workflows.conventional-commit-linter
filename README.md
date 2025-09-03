# GitHub Workflows — Conventional Commit Linter

This repository provides a **reusable GitHub Actions workflow** and a central **`commitlint.config.js`** to enforce **Conventional Commits** across all repos. Consumer repositories reference the workflow here—no scripts or rules duplicated per repo.

---

## What’s in this repo

- `commitlint.config.js` — shared rules + message text used by the validator
- `.github/workflows/commitlint.yml` — reusable workflow that validates commit messages and comments on PRs

---

## How to use (in a consumer repo)

Create a workflow file at `.github/workflows/commitlint.yml` in the consumer repo with:

```yaml
name: Lint Commit Messages

on:
  pull_request:
    types: [opened, synchronize, edited, reopened]
  push:
    branches: [main, master]
  workflow_dispatch: {}

permissions:
  contents: read
  pull-requests: write

jobs:
  commitlint:
    uses: ExtendRealityLtd/github-workflows.conventional-commit-linter/.github/workflows/commitlint.yml@main
    # (optional) override which repo/ref the config is sourced from:
    # with:
    #   config-repo: ExtendRealityLtd/github-workflows.conventional-commit-linter
    #   config-ref: main
```

> **Why the `permissions` block?**  
> The reusable workflow posts PR comments on failures; the caller must grant `pull-requests: write`.

---

## Commit format (Conventional Commits)

Each commit message must follow:

```
<type>(<scope>)<!?>: <subject>
<blank line>
<body>
<blank line>
<footer lines...>
```

- **Header**: `<type>(<scope>)<!?>: <subject>`
- **Body**: free-form explanation (what & why). Required for certain types (see below).
- **Footer(s)**: metadata lines such as `BREAKING CHANGE: ...`, `Closes #123`.

> `BREAKING CHANGE:` is a **footer**, not body.

---

## Rules enforced

From `commitlint.config.js` (central, shared):

- **Allowed types**: `feat`, `fix`, `chore`, `refactor`
- **Scope**: **required** and non-empty → `type(scope): subject`
- **Subject**:
  - required
  - **starts lowercase**
  - **min 3 chars**
  - **no trailing period**
- **Header length**: ≤ **72** chars
- **Blank line**: **required** immediately after the header
- **Body required for types**: **feat**, **fix**, **chore**, **refactor**  
  (Must include at least one **non-footer** line explaining what/why.)
- **Line length limits**:
  - body lines ≤ **72**
  - footer lines ≤ **72**
- **Breaking-change consistency**:
  - If header has `!` → must include a `BREAKING CHANGE:` footer
  - If a `BREAKING CHANGE:` footer exists → header must include `!`

### Policy toggle (central)

You can relax “body required” for breaking changes by letting the footer count as body. Toggle in `commitlint.config.js`:

```js
customRules: {
  bodyRequiredForTypes: ['feat', 'fix', 'chore', 'refactor'],
  enforceBreakingChangeConsistency: true,

  // set to true to allow footer-only commits to pass the "body required" rule
  footerCountsAsBody: false
}
```

---

## Examples

**✅ Valid — normal change**
```
feat(api): add search endpoint

Add a new /search endpoint returning paginated results.
```

**✅ Valid — breaking change (with body)**
```
feat(auth)!: switch token format to JWT

JWT simplifies stateless auth and improves interoperability.

BREAKING CHANGE: tokens are no longer opaque; clients must handle JWTs.
```

**❌ Invalid — missing scope**
```
feat: add search endpoint
```

**❌ Invalid — subject starts uppercase**
```
fix(api): Fix off-by-one in pagination
```

**❌ Invalid — trailing period**
```
chore(repo): bump dependencies.
```

**❌ Invalid — header too long (>72)**
```
refactor(api): massively rename many things in many modules which makes this header too long to be acceptable
```

**❌ Invalid — missing blank line after header**
```
feat(api): add search endpoint
Explain what changed (must be after a blank line)
```

**❌ Invalid — body required but only footer present**
```
feat(api)!: change output shape

BREAKING CHANGE: result object now includes `meta` field
```
> This fails unless `footerCountsAsBody: true` is enabled centrally.

**❌ Invalid — `!` in header but no breaking footer**
```
feat(api)!: change output shape

Explain what changed and why.
```

**❌ Invalid — breaking footer but no `!` in header**
```
feat(api): change output shape

Explain what changed and why.

BREAKING CHANGE: result object now includes `meta` field
```

---

## Troubleshooting

- **“The workflow is requesting 'pull-requests: write'…”**  
  Add the `permissions` block (shown above) to the **caller** workflow in the consumer repo.

- **PR comment shows only `❌` with no reason**  
  Ensure the central `commitlint.config.js` contains the message keys (e.g. `breakingNeedsFooter`, `footerNeedsBang`) and that the consumer is calling the latest `@master`.

- **“command not found” / exit 127**  
  Make sure consumer repos call the **reusable workflow** (not a composite action), and keep the Node setup step in the central workflow.

---

## Versioning / pinning

Consumers reference:
```
uses: ExtendRealityLtd/github-workflows.conventional-commit-linter/.github/workflows/commitlint.yml@main
```
Pin to a tag or commit SHA if you need a frozen version.

---

## Source of truth

All rules & messages live in **this repo’s** `commitlint.config.js`.  
Consumers do **not** need to copy config or scripts; they only reference the reusable workflow here.

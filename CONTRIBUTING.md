# Contributing to CogniPlan

This document is the quick-start guide for teammates contributing to this repository.

## Workflow Model

We use a Branch-per-Feature workflow.

- Do not push directly to `main` or `dev`.
- Create a feature branch for every task.
- Open Pull Requests (PRs) into `dev`.

## Branching Steps

```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-name-task-description
```

## Pull Request Rules

- Push your feature branch and create a PR targeting `dev`.
- Ensure CI/checker is green before requesting merge.
- If checks fail, fix the issue in your branch and push again.
- Keep PRs focused and small (single feature/fix when possible).

## Folder Ownership

- **Role 1 (`role1-systems-logic`)**: Database, API, and SRS logic.
- **Role 2 (`role2-realtime-engine`)**: Sockets, video sync, and whiteboard engine.
- **Role 3 (`role3-ux-experience`)**: UI, dashboards, and visual integration.

Do not modify another role folder without team sync.

## Commit Guidelines

- Write clear, action-based commit messages.
- Suggested style: `type: short description`
  - Example: `feat: add review queue card component`
- Commit only related changes together.

## Before You Push

- Pull latest `dev` and rebase/merge as needed.
- Run relevant local checks for your role’s code.
- Confirm no secrets or `.env` files are included.

## Communication

During team sync, share:

- What you completed
- What you are doing next
- Any blockers

# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# Framework

- Use Next.js (not TanStack Start) — project is already scaffolded with Next.js, keep the existing setup. Confidence: 0.70

# Naming

- Use kebab-case for component files and names (e.g., wordmark, wordmark-button) — no camelCase, no capital letters. Confidence: 0.70

# Prisma

- Place the Prisma generated client output in the project root (e.g., `generated/prisma`), not under `lib/`. Confidence: 0.65

# Architecture

- No cron jobs — this is a demo app deployed on Vercel. Trigger reminders and scheduled actions manually through the owner dashboard instead. Confidence: 0.65

# Code Style

- Do not add comments to code files — keep files clean and comment-free. Confidence: 0.85

# Zod

- In Zod v4, use standalone schema constructors like `z.email()` and `z.url()` instead of chaining methods like `.email()` or `.url()` on `z.string()`. Confidence: 0.85

# Workflow

See [workflow/taste.md](workflow/taste.md)

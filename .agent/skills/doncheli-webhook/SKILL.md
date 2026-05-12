---
name: doncheli-webhook
description: Configure and test webhooks and external triggers (GitHub, Slack, Linear, CI/CD) to automate Don Cheli commands. Activate when user mentions "webhook", "GitHub webhook", "Slack integration", "CI/CD webhook", "external triggers", "trigger automation", "automate Don Cheli", "event hook".
---

# Don Cheli: Webhook & Automation

## Instructions

1. Accept the desired webhook configuration: event, target URL, payload format, secret
2. Detect the platform (GitHub Actions, custom server, Zapier, etc.) from context
3. Generate the webhook configuration code/YAML for the detected platform
4. Validate the target URL is reachable if possible (HTTP HEAD check)
5. Generate a test payload that matches the event schema
6. Provide a `curl` command to manually test the webhook
7. Check for security best practices:
   - HTTPS endpoint required (flag plain HTTP as a blocker)
   - Webhook secret / HMAC signature validation
   - Idempotency key handling for retries
8. Document the webhook in `.dc/webhooks.md` with: event, URL, owner, secret env var name
9. Never log or print the actual secret value — always reference the env var name

## Output Format

```
## Webhook Configuration — pr_merged → deploy

### Config (GitHub Actions)
on:
  pull_request:
    types: [closed]

### Test Command
curl -X POST https://your-app.com/hooks/deploy \
  -H "X-Hub-Signature-256: sha256=<computed>" \
  -H "Content-Type: application/json" \
  -d '{"action":"closed","merged":true,"branch":"main"}'

### Security Checklist
✅ HTTPS endpoint
✅ HMAC signature validation required
⚠️  Add idempotency key handling to prevent duplicate deploys on retry

### Registered in .dc/webhooks.md
Event: pull_request.closed + merged
Target: https://your-app.com/hooks/deploy
Secret: $WEBHOOK_SECRET_DEPLOY
```

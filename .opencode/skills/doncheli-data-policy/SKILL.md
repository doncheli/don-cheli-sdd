---
name: doncheli-data-policy
description: Audit and document what personal or sensitive data the project collects, processes, and stores. Activate when user mentions "privacy", "data policy", "what data", "GDPR", "personal data", "data retention", "PII".
---

# Don Cheli: Data Policy Auditor

## Instructions

1. Scan the codebase for PII and sensitive data patterns:
   - Database models / schemas for fields like email, phone, name, address, IP, location
   - API request/response payloads
   - Logging statements that may capture sensitive fields
   - Third-party integrations that receive user data
2. Build a data inventory table: field name, model, purpose, retention, shared with
3. Check against common compliance requirements:
   - GDPR: lawful basis, right to erasure, data minimization
   - CCPA: disclosure, opt-out
   - SOC2: access controls, encryption at rest/transit
4. Flag violations as [critical | warning | info]
5. Generate a draft Privacy Notice section if requested (`--generate-notice`)
6. Save the audit to `.dc/data-policy-audit-<date>.md`
7. Never make assumptions about compliance status — only report findings and flag gaps

## Output Format

```
## Data Policy Audit — 2026-03-28

### Data Inventory
| Field     | Model      | Purpose       | Retention | Shared With     |
|-----------|-----------|---------------|-----------|----------------|
| email     | User       | Auth, comms   | Indefinite| SendGrid, Auth0|
| ip_address| AuditLog   | Security      | 90 days   | Internal only  |

### Compliance Gaps
🔴 CRITICAL: ip_address logged in plain text in audit_logs — encrypt or hash
🟡 WARNING:  No data retention policy enforced for User.email — GDPR Art. 5(e)
🟢 INFO:     No right-to-erasure endpoint found — required for GDPR compliance

### Recommendations
1. Add @Encrypted() decorator to ip_address field
2. Implement DELETE /users/:id endpoint that purges all PII
3. Document data retention in Privacy Policy
```

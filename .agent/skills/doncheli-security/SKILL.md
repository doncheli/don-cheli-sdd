---
name: doncheli-security
description: Perform OWASP Top 10 static security audit detecting injection, XSS, CSRF, CVEs and misconfigurations. Activate when user mentions "security audit", "OWASP", "security scan", "vulnerabilities", "pentest", "XSS", "CSRF", "CVEs", "SQL injection", "security before deploy".
---

# Don Cheli: OWASP Security Audit

## Categories
- A01: Broken Access Control — endpoints without auth, IDOR, CORS
- A02: Cryptographic Failures — plaintext passwords, JWT without expiration
- A03: Injection — SQL, XSS, command injection
- A04: Insecure Design — missing validation, bypassable business logic
- A05: Security Misconfiguration — debug mode, default credentials, missing headers
- A06: Vulnerable Components — dependencies with known CVEs
- A07: Auth Failures — no brute-force protection, no session management
- A08: Data Integrity — insecure deserialization
- A09: Logging Failures — no audit log for security operations
- A10: SSRF — unvalidated user-supplied URLs

## Output
For each finding: ID, severity (Critical/High/Medium/Low), OWASP category, file:line, description, impact, recommended fix, effort estimate.

# Security Policy

## 🔒 Commitment to Security and Privacy

At MindCheck AI, personal reflections, journal entries, and emotional check-in history are treated as sensitive personal data. We follow privacy-first engineering standards:

- **Local-First Architecture**: By default, data is stored securely in the user's local client storage sandbox, requiring zero external transmission.
- **Row-Level Security (RLS)**: When connected to Supabase PostgreSQL, all tables enforce strict RLS policies (`auth.uid() = user_id`) preventing cross-user data exposure.
- **Server-Side API Operations**: All external AI interactions pass through authenticated server-side route handlers with sanitized inputs; client code never contains secret API keys.
- **Stateless AI Requests**: Prompts sent to the AI companion are processed ephemerally and are not retained or utilized to train general AI models.

## 🛡️ Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or privacy concern within MindCheck AI:

1. Please **do not** open a public issue on GitHub.
2. Email your findings directly to the maintainers or report via GitHub Security Advisories.
3. Provide a clear description of the potential vulnerability, including steps to reproduce.
4. We aim to acknowledge receipt within 48 hours and provide a coordinated disclosure timeline.

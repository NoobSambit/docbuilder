# System Architecture Overview

For complete architecture details, see [DOCUMENTATION.md](../../DOCUMENTATION.md#system-architecture).

## Quick Overview

AI Document Builder uses a three-tier architecture:
- **Client**: Next.js + React + TailwindCSS
- **Application**: FastAPI + LangChain
- **Data**: Firebase Firestore + Google APIs

## Architecture Diagram

```
CLIENT → API → SERVICES → DATA
```

See main documentation for details.

[← Back to Documentation Home](../README.md)

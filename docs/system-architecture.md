# System Architecture

The Excel AI Governance Assistant is organized as a three-layer AI workflow system.

```mermaid
flowchart TD
    A[User Request] --> B[Application Layer]
    B --> C[Access Control + Session Handling]
    C --> D[LLM API Request]
    D --> E[Control Layer]
    E --> F[Structured Workflow]
    F --> G[Intake]
    G --> H[Structure Lock]
    H --> I[Controlled Build]
    I --> J[Validation Gates]
    J --> K[Diagnostic Recovery]
    K --> L[Controlled Output]
```

## Layer Summary

### Application Layer
Handles user interaction, session continuity, access control, and API communication.

### Control Layer
Defines the system behavior, response discipline, workflow rules, and failure-control logic.

### Workflow Layer
Guides the user through intake, structure confirmation, staged execution, validation, and recovery.

## Public Safety Note

This document explains the system architecture without exposing protected prompt logic, credentials, backend implementation details, or proprietary workflow rules.

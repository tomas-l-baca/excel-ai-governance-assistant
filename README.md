# Excel AI Governance Assistant

LLM workflow orchestration system designed to produce reliable, controlled outputs for Excel engineering and automation tasks.

---

## Problem

Using LLMs for complex spreadsheet work is unreliable.

Common failure points:
- Hallucinated formulas or incorrect logic  
- Loss of structure across multi-step tasks  
- Inconsistent outputs between runs  
- Silent data corruption or incorrect transformations  

This makes LLMs difficult to trust in real operational workflows.

---

## Solution

This project introduces a **controlled execution system** that governs how an LLM is used during spreadsheet engineering tasks.

Instead of relying on freeform prompting, the system enforces:

- Structured intake before execution  
- Step-by-step workflow progression  
- Validation gates before advancing  
- Diagnostic recovery when failures occur  

The goal is to transform LLM usage from **unpredictable interaction** into **reliable system behavior**.

---

## System Overview

## Application Interface

![Excel AI Governance Assistant Interface](assets/application-interface.png)

The system is built as a layered architecture:

### 1. Application Layer
- Web-based interface for user interaction  
- Access control and session handling  
- API communication with LLM services  

### 2. Control Layer
- Master prompt defining system behavior  
- Execution protocol governing interaction flow  
- Constraints to reduce hallucination and drift  

### 3. Workflow Layer
- Intake → Structure Lock → Controlled Build → Validation → Diagnostic Recovery  
- Stage isolation to prevent premature execution  
- Explicit validation checkpoints before progression  

---

## Key Capabilities

- Controlled multi-step LLM execution  
- Validation-driven workflow design  
- Failure detection and recovery logic  
- Reduction of hallucination and output drift  
- Structured problem-solving for spreadsheet engineering  

---

## Example Use Cases

- Excel formula development  
- VBA automation support  
- Data cleanup and normalization  
- Operational reporting workflows  
- Structured spreadsheet builds  

---

## What This Demonstrates

- LLM workflow orchestration  
- AI systems design for reliability  
- Prompt architecture with behavioral control  
- Validation and failure-handling design  
- Real-world application of AI in technical workflows  

---

## Project Status

This repository is a **public-safe version** of a working system.

To protect intellectual property and sensitive logic:

- Full prompt systems are not published  
- Backend implementation details are partially abstracted  
- Examples and diagrams will be added to demonstrate behavior  

---

## Next Steps

- Add system architecture diagram  
- Add sanitized workflow examples  
- Add sample input/output demonstrations  
- Add demo screenshots of application interface  

---

## Recruiter Quick View

**What this is:**  
A system that makes AI usable for real technical work.

**What it proves:**  
- Ability to design controlled AI workflows  
- Understanding of LLM failure modes  
- Experience building structured, repeatable systems  

**Where to look first:**  
- System Overview  
- Key Capabilities  

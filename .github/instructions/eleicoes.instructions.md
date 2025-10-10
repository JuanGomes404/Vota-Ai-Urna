---
applyTo: "**"
---

# Project Overview
The project is an **Electronic Voting System** for an academic Final Year Project (TCC).
The main goal is to create a secure, efficient, and anonymous web application to replace manual election processes.
The architecture is a **Typescript** backend with a **Vue.js** frontend.
The absolute top priorities are **security**, **data integrity**, and the **complete anonymity of the vote**.
This is a MVP (Minimum Viable Product) and should focus on core functionalities only.
Garanteedly avoid overengineering or adding unnecessary features.


---
## Core Non-Functional Requirements (RNF)
The entire system must adhere to these quality attributes:
- **Security & Anonymity (RNF01):** All communication must be encrypted (HTTPS). The vote must be completely anonymous, with no possible technical link between a voter's identity and their cast vote.
- **Data Integrity (RNF04):** A vote, once cast, cannot be altered. A voting credential can only be used once. All critical operations that change data (e.g., casting a vote) must be atomic and transactional.
- **Auditability (RNF05):** The system must log critical events (e.g., user login, voter authorization attempts, vote casting events) to allow for transparent process verification. Logs must not contain sensitive voter-vote information.
- **Usability (RNF02):** The UI must be clean, intuitive, and responsive. The Voting Booth interface, in particular, must be extremely simple to prevent user error.

---
## Functional Requirements (RF)
### Admin Module
- `ADMIN` users must be able to log in.
- `ADMIN` users must be able to create a new election, defining its name and candidates.
- `ADMIN` users must be able to upload the list of eligible voters for an election.
- `ADMIN` users must be able to start and end an election period.
- `ADMIN` users must be able to view the final, consolidated results only after an election is closed.

### Poll Worker (`Mesário`) Module
- `POLL_WORKER` users must be able to log in.
- The system must allow a `POLL_WORKER` to search for a voter by their student ID.
- The system must display the voter's status (`ELIGIBLE_TO_VOTE` or `HAS_VOTED`).
- The system must allow a `POLL_WORKER` to authorize an eligible voter, which triggers the generation of a credential.

### Voting Booth (`Urna`) Module
- **RF10:** The booth must prompt the user to enter a unique voting credential.
- **RF11:** The booth must validate that the credential is authentic and has not been previously used.
- **RF12:** Upon successful validation, the booth must display the candidates for the associated election.
- **RF13:** A confirmation screen must be shown to the voter before finalizing the vote.
- **RF14:** The vote must be recorded completely anonymously.
- **RF15:** The credential must be permanently invalidated immediately after the vote is recorded.

---
## Core Business Rules (RN)
All generated code must strictly enforce the following rules:
1.  **RN01:** Elections can only be created and managed by an `ADMIN` user.
2.  **RN02:** An election must have a name, candidates, and an imported voter list to exist.
3.  **RN03:** Voting is only permitted when the election's status is `ACTIVE`.
4.  **RN04:** Election results are only visible after the election's status is `CLOSED`.
5.  **RN05:** Only a student from the imported voter list can be authorized to vote.
6.  **RN06:** Each voter can vote only **once** per election.
7.  **RN07:** The status indicating a voter has already voted is irreversible.
8.  **RN08:** A voter must be authorized by a `POLL_WORKER` before they can vote.
9.  **RN09:** A successful authorization must generate a unique, single-use `Credential`.
10. **RN10:** The Voting Booth is anonymous and only accepts the `Credential` as input, never any voter-identifying information.
11. **RN11:** A `Credential`, once used, must be permanently invalidated.
12. **RN12:** The system has two access levels: `ADMIN` (full control) and `POLL_WORKER` (voter authorization only).
13. **RN13:** The system architecture must guarantee that it is technically impossible to link a voter's identity to their cast vote.

---
## Technology Stack & Architectural Patterns
- **Backend:** TypeScript with Node.js and Express.
- **Frontend:** Vue.js (Composition API), TypeScript, Vite, Vuetify.
- **Database:** PostgreSQL with Prisma.
- **ORM** - Prisma
- **Data Transfer:** Use DTOs for all API payloads, validated with class-validator.

---
## Coding Style and Conventions
- **Typescript:** Follow standard TypeScript Naming Conventions.
- **Vue.js:** Use the Composition API with `<script setup lang="ts">`.
- **General:** Code must be clean, readable, and include JSDoc/TSDoc comments for public APIs and complex logic.
- Using MVC and Service layer patterns to ensure separation of concerns.
- Ensure all code using REST for API endpoints follows RESTful principles.
- DO NOT OVERENGINEER. Focus on core functionalities only.
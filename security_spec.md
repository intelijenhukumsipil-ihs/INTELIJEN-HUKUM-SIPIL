# security_spec.md - Firebase Security Specification

This document details the security design, data invariants, and the "Dirty Dozen" penetration-testing payloads for the Intelijen Hukum Sipil (IHS) Firebase architecture.

## 1. Data Invariants

### Cases (`/cases/{caseId}`)
- **Owner-Binding**: A newly created case must have `userId` matching the creator's authenticated UID.
- **State Progression**: Once a case status is marked as "selesai" or "ditutup" (terminal states), it cannot be modified.
- **Relational Integrity**: If the reporter is signed in, `userId` must equal `request.auth.uid`.
- **Field Constraints**: Mandatory fields (`title`, `category`, `location`, `chronology`) must be strings with strict length boundaries.

### Publications (`/publications/{pubId}`)
- **Read-Only Public**: Anyone can read news publications.
- **Admin-Only Write**: Writing (create/update/delete) is strictly limited to authorized administrators.

### Members (`/members/{memberId}`)
- **Registration Integrity**: Any signed-in user can register. They must set `userId` to their own UID, and `isVerified` must be `false` upon creation.
- **Role Elevation Guard**: Users are forbidden from verifying themselves (`isVerified` can only be set to `true` by an administrator).

### Sync Logs (`/sync_logs/{logId}`)
- **Immutability**: Logs are append-only. Once created, they cannot be updated or deleted.

---

## 2. The "Dirty Dozen" Payloads
The following 12 payloads are designed to attack the system. The Firebase Security Rules are designed to return `PERMISSION_DENIED` for all of them:

1. **Self-Verification Privilege Escalation**: A user registers as a member and sets `isVerified: true` in their payload.
2. **Identity Spoofing (Case Owner)**: User `attacker123` tries to create a case with `userId: victim456`.
3. **Ghost Field Injection**: User tries to insert `shadow_admin_flag: true` into their member profile or case document.
4. **Denial of Wallet (Huge String ID)**: An attacker tries to create a case with a 2MB document ID or huge string values.
5. **Unauthorized Case Tampering**: An unverified user attempts to update another user's case report.
6. **Terminal State Bypass**: A user tries to change the status of a case that is already marked as `selesai`.
7. **Ad-Hoc Publication Overwrite**: A normal user tries to post an article into the `/publications` collection.
8. **Malicious Log Alteration**: A user tries to overwrite or delete a sync log in `/sync_logs` to cover their tracks.
9. **Unverified Email Administrator Spoof**: A user with an unverified email `admin@ihsid.org` tries to write to `/publications`.
10. **Array Poisoning Attack**: Attacker injects a huge, deep nested list structure as `evidenceFiles`.
11. **Client-Assigned Timestamp Spoof**: User sets `createdAt` to a historical or future timestamp instead of `request.time`.
12. **Foreign Case Hijacking**: A user tries to query list of cases without restricting the filter to their own `userId`.

---

## 3. Test Cases (firestore.rules.test.ts Specification)

Below is the theoretical test specification verifying that the "Dirty Dozen" payloads fail:

```typescript
// Test 1: Self-Verification
assertFails(
  db.collection("members").doc("user_1").set({
    userId: "user_1",
    name: "John Doe",
    role: "Advokat",
    organization: "LBH",
    location: "Garut",
    isVerified: true
  })
);

// Test 2: Identity Spoofing
assertFails(
  db.collection("cases").doc("case_1").set({
    id: "case_1",
    ticketNumber: "IHS-2026-0099",
    title: "Sengketa Lahan",
    category: "Agraria/Lingkungan",
    reporterName: "Victim",
    reporterContact: "0811",
    isAnonymous: false,
    location: "Sleman",
    chronology: "Detail kronologi sengketa...",
    dateSubmitted: new Date().toISOString(),
    status: "diterima",
    userId: "victim456" // Attacker is signed in as attacker123
  })
);

// Test 3: Ghost Field
assertFails(
  db.collection("members").doc("user_1").set({
    userId: "user_1",
    name: "John Doe",
    role: "Advokat",
    organization: "LBH",
    location: "Garut",
    isVerified: false,
    admin_secret: "override_rules"
  })
);
```

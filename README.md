# 💊 GramCare — Blockchain Powered Healthcare System

## ✨ Overview

GramCare is a secure and transparent healthcare ecosystem that connects Patients, Doctors, and Pharmacies, leveraging **blockchain technology** to eliminate prescription fraud and improve accessibility.

Prescriptions are anchored on the blockchain to guarantee immutability.

* **Patients** use a Flutter mobile app for consultations, receiving QR-coded, blockchain-verified prescriptions, and checking real-time pharmacy stock.
* **Doctors** issue prescriptions and conduct audio/video consultations.
* **Pharmacies** use a React dashboard to scan, verify prescriptions against the blockchain, and update stock.

### 🔗 BLOCKCHAIN — CORE HIGHLIGHT

At the heart of GramCare is a blockchain-based prescription verification system that prevents fake prescriptions and builds trust between all parties.

#### How it Works (High Level)

1.  **Issuance:** Doctor issues a prescription via the backend. Prescription details are sent to a Solidity smart contract (e.g., `PrescriptionRegistry.sol`).
2.  **Anchoring:** The smart contract stores an **immutable record**, producing a unique **Transaction Hash (Tx Hash)**.
3.  **Storage:** The backend stores the **Tx Hash** alongside minimal prescription metadata in the MongoDB database.
4.  **Delivery:** A **QR code** (containing the prescription ID or Tx Hash) is generated and delivered to the patient via the Flutter app.

#### Verification Process

1.  Pharmacy scans the QR code.
2.  Backend retrieves the on-chain record using the Tx Hash.
3.  Backend verifies authenticity:
    * If on-chain data and metadata match → **authentic ✅**
    * If mismatch → **flagged as fake ❌**

---

## 🔑 Key Features

### Patient (Flutter)
* Secure registration & profile.
* Book appointments.
* Audio/video consultations with doctors.
* Receive **blockchain-backed prescriptions via QR code**.
* View pharmacy stock updates (reflected from pharmacy dashboard).
* Scan and verify prescriptions.

### Doctor
* Issue **blockchain-backed prescriptions (Tx Hash generation)**.
* Manage appointments and patient records.
* Start audio/video consultations.

### Pharmacy (React)
* Scan QR codes from patient prescriptions.
* **Verify prescription authenticity against blockchain**.
* Update medicine stock (updates seen by patients).
* Manage prescription history and fulfillments.


---

## 💻 System Workflow (Simple)

```mermaid
graph TD
    A[Doctor] -->|Issues Prescription| B(Smart Contract - on-chain);
    B -->|Tx Hash| C(MongoDB - metadata);
    C --> D[QR code delivered to Patient (Flutter)];
    D --> E[Patient Shows QR code to Pharmacy];
    E --> F[Pharmacy Scans QR];
    F --> G[Backend verifies on-chain using Tx Hash];
    G -->|If Valid| H[Dispense Medicine];
    G -->|If Invalid| I[Flag & Report];

    

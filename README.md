# 🌱 GramCare — Blockchain Powered Healthcare System

## 🔗 Blockchain — Core Highlight

At the heart of **GramCare** is a **blockchain-based prescription verification system** that prevents fake prescriptions and builds trust between **Doctors, Patients, and Pharmacies**.

---

## 🧠 How It Works (High-Level)

1. A **Doctor issues a prescription** via the backend.
2. Prescription details are sent to a **Solidity smart contract** (e.g., `PrescriptionRegistry.sol`).
3. The smart contract stores an **immutable on-chain record**, generating a **Transaction Hash (Tx Hash)**.
4. The backend stores this **Tx Hash with minimal prescription metadata** in **MongoDB**.
5. A **QR code** (containing the prescription ID or Tx Hash) is generated for the **Patient**.
6. The **Pharmacy scans the QR code**:
   - Backend retrieves the on-chain record using the Tx Hash
   - Compares on-chain data with stored metadata

✅ If data matches → **Authentic prescription**  
❌ If mismatch → **Flagged as fake**

---

## 🏥 System Overview

GramCare connects **Patients, Doctors, and Pharmacies** in a secure ecosystem.

- Prescriptions are **anchored on blockchain** to guarantee immutability
- **Patients** use a Flutter mobile app
- **Pharmacies** use a React-based dashboard
- **Doctors** conduct audio/video consultations and issue prescriptions
- **Pharmacy stock updates** are reflected to patients in real time

---

## 🌍 Access for Rural & Offline Communities

For users without internet access or digital literacy:
- Patients can visit their **nearest Panchayat office**
- Health workers assist them in connecting with doctors and healthcare services

---

## ✨ Key Features

### 👤 Patient (Flutter App)
- Secure registration & profile management
- Appointment booking
- Audio/video consultation with doctors
- Receive **blockchain-backed prescriptions** via QR code
- View real-time pharmacy stock updates
- Scan and verify prescriptions

### 👨‍⚕️ Doctor
- Issue blockchain-backed prescriptions (Tx Hash generation)
- Manage appointments and patient records
- Conduct audio/video consultations

### 🏪 Pharmacy (React Dashboard)
- Scan QR codes from patient prescriptions
- Verify prescription authenticity via blockchain
- Update medicine stock (visible to patients)
- Manage prescription history and fulfillment records

---

## 🧰 Tech Stack (Concise)

- **Mobile App:** Flutter
- **Pharmacy Dashboard:** React.js
- **Backend API:** Node.js (Express)
- **Blockchain:** Solidity, Hardhat (Ethereum / Polygon / Testnet)
- **Database:** MongoDB
- **Realtime / Video:** WebRTC or Agora SDK
- **QR Scanning:** `mobile_scanner` (Flutter)

---

## 🔄 System Workflow (Simple)

```text
Doctor
  ↓
Issues Prescription
  ↓
Smart Contract (Blockchain)
  ↓
Transaction Hash (Tx Hash)
  ↓
MongoDB (Metadata Storage)
  ↓
QR Code → Patient (Flutter App)

Patient
  ↓
Shows QR Code

Pharmacy
  ↓
Scans QR Code
  ↓
Backend verifies on-chain data
  ↓
Valid → Dispense medicine
Invalid → Flag & report

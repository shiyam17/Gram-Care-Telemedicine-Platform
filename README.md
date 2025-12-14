# 🌱 GramCare — Blockchain Powered Healthcare System

## 🔗 Blockchain — Core Highlight

At the heart of **GramCare** is a blockchain-based prescription verification system that prevents fake prescriptions and builds trust between **Doctors, Patients, and Pharmacies**.

---

## 🧠 How It Works (High Level)

1. Doctor issues a prescription via the backend.
2. Prescription details are sent to a Solidity smart contract (e.g., `PrescriptionRegistry.sol`).
3. The smart contract stores an immutable on-chain record and generates a **Transaction Hash (Tx Hash)**.
4. The backend stores the Tx Hash along with minimal prescription metadata in **MongoDB**.
5. A **QR code** (containing the prescription ID or Tx Hash) is generated for the patient.
6. Pharmacy scans the QR code and the backend retrieves the on-chain record using the Tx Hash to verify authenticity.

### Verification Result
- ✅ **If on-chain data and metadata match** → Authentic prescription
- ❌ **If mismatch** → Flagged as fake

---

## 🏥 System Overview

GramCare connects **Patients, Doctors, and Pharmacies** in a secure healthcare ecosystem.

- Prescriptions are anchored on **blockchain** to guarantee immutability
- **Patients** use a Flutter mobile application
- **Pharmacies** use a React-based dashboard
- **Doctors** issue prescriptions and conduct audio/video consultations
- Pharmacy stock updates are reflected back to patients in **real time**

---

## 🌍 Access for Those Without Internet or Literacy

Patients who are illiterate or without internet access can visit their **nearest Panchayat office**, where health workers help them connect with doctors and healthcare services.

---

## ✨ Key Features

### 👤 Patient (Flutter App)
- Secure registration and profile management
- Appointment booking
- Audio/video consultations with doctors
- Receive blockchain-backed prescriptions via QR code
- View pharmacy stock updates (from pharmacy dashboard)
- Scan and verify prescriptions

### 👨‍⚕️ Doctor
- Issue blockchain-backed prescriptions (Tx Hash generation)
- Manage appointments and patient records
- Start audio/video consultations

### 🏪 Pharmacy (React Dashboard)
- Scan QR codes from patient prescriptions
- Verify prescription authenticity using blockchain
- Update medicine stock (visible to patients)
- Manage prescription history and fulfillment

---

## 🧰 Tech Stack (Concise)

- **Mobile App:** Flutter
- **Pharmacy Dashboard:** React.js
- **Backend API:** Node.js (Express)
- **Blockchain:** Solidity, Hardhat (Ethereum / Polygon / Testnet)
- **Database:** MongoDB
- **Realtime / Video:** WebRTC or Agora SDK
- **QR Scanning:** mobile_scanner (Flutter)

---

## 🔄 System Workflow (Simple)

Doctor → Issues Prescription → Smart Contract (On-chain)  
→ Transaction Hash → MongoDB (Metadata)  
→ QR Code delivered to Patient (Flutter App)

Patient → Shows QR Code to Pharmacy

Pharmacy → Scans QR Code → Backend verifies on-chain using Tx Hash  
- If valid → Dispense medicine  
- If invalid → Flag and report  

---

## ⚙️ Quick Setup (Local Development)

### 🔧 Backend (Node.js + Smart Contracts)

```bash
cd backend
npm install

# Run a local blockchain node for testing
npx hardhat node

# Compile smart contracts
npx hardhat compile

# Deploy contracts to local node
npx hardhat run scripts/deploy.js --network localhost

# Start backend server
npm run dev

// const express = require('express');
// const cors = require('cors');
// const { MongoClient } = require('mongodb');
// const dotenv = require('dotenv');
// const Joi = require('joi');

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Config
// const uri = process.env.ATLAS_URI;
// const dbName = process.env.DB_NAME || 'gramcare';
// const patientsCollectionName = process.env.COLLECTION_NAME || 'patients';

// if (!uri) {
//   console.error('Missing ATLAS_URI in .env');
//   process.exit(1);
// }

// const client = new MongoClient(uri, {
//   serverSelectionTimeoutMS: 10000,
//   tls: true,
// });

// let db;
// let patients;

// // Validation schemas
// const signupSchema = Joi.object({
//   fullName: Joi.string().min(2).max(120).required(),
//   dob: Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).required(),
//   gender: Joi.string().valid('Male', 'Female', 'Other').allow(null, ''),
//   address: Joi.string().min(4).max(500).required(),
//   primaryPhone: Joi.string().min(7).max(20).required(),
//   altPhone: Joi.string().allow('', null),
//   email: Joi.string().email({ tlds: { allow: false } }).allow('', null),
//   govId: Joi.string().min(3).max(80).required(),
//   language: Joi.string().min(2).max(40).allow(null, ''),
//   emergencyName: Joi.string().min(2).max(120).required(),
//   emergencyPhone: Joi.string().min(7).max(20).required(),
//   conditions: Joi.string().allow('', null),

//   // Optional extras used by profile screen
//   allergies: Joi.string().allow('', null),
//   chronicMeds: Joi.string().allow('', null),
//   vitals: Joi.string().allow('', null),
//   bloodGroup: Joi.string().allow('', null),
//   pharmacy: Joi.string().allow('', null),
//   primaryDoctor: Joi.string().allow('', null),
//   consentTreatment: Joi.string().allow('', null),
//   consentResearch: Joi.string().allow('', null),
//   insuranceProvider: Joi.string().allow('', null),
//   policyNumber: Joi.string().allow('', null),
//   device: Joi.string().allow('', null),
//   lastSync: Joi.string().allow('', null),

//   login: Joi.string().min(3).max(120).required(),
//   password: Joi.string().min(6).max(200).required(),
//   agreePolicy: Joi.boolean().valid(true).required(),
// });

// const loginSchema = Joi.object({
//   userType: Joi.string()
//     .valid('Patient', 'Doctor', 'Pharmacy', 'HealthWorker', 'GovernmentOfficial', 'Admin')
//     .required(),
//   username: Joi.string().min(1).max(200).required(),
//   password: Joi.string().min(1).max(200).required(),
//   remember: Joi.boolean().optional(),
// });

// // Helpers
// function getCollectionByUserType(type) {
//   switch (type) {
//     case 'Patient': return db.collection('patients');
//     case 'Doctor': return db.collection('doctors');
//     case 'Pharmacy': return db.collection('pharmacies');
//     case 'HealthWorker': return db.collection('healthworkers');
//     case 'GovernmentOfficial': return db.collection('governmentofficials');
//     case 'Admin': return db.collection('admins');
//     default: return null;
//   }
// }

// async function start() {
//   await client.connect();
//   db = client.db(dbName);
//   patients = db.collection(patientsCollectionName);

//   try {
//     await patients.createIndex({ login: 1 }, { unique: true });
//     console.log('Ensured unique index on patients.login');
//   } catch (e) {
//     console.warn('WARNING: Could not create unique index on patients.login:', e?.message || e);
//   }

//   console.log('Connected to MongoDB Atlas');
// }

// // Health
// app.get('/health', (_req, res) => res.json({ ok: true }));

// // Username availability
// app.get('/api/patient-username-available', async (req, res) => {
//   try {
//     const login = String(req.query.login ?? '').trim();
//     if (!login) return res.status(200).json({ available: false });
//     const exists = await patients.findOne({ login });
//     return res.status(200).json({ available: !exists });
//   } catch (e) {
//     console.error('Availability check error:', e?.message || e);
//     return res.status(200).json({ available: false });
//   }
// });

// // Signup
// app.post('/api/patientsigin', async (req, res) => {
//   try {
//     const { error, value } = signupSchema.validate(req.body, { abortEarly: false });
//     if (error) {
//       return res.status(400).json({
//         message: 'Validation failed',
//         details: error.details.map((d) => d.message),
//       });
//     }

//     const existing = await patients.findOne({ login: value.login });
//     if (existing) {
//       return res.status(409).json({ message: 'Username already exists' });
//     }

//     const now = new Date();
//     const doc = { ...value, createdAt: now, updatedAt: now };

//     try {
//       const result = await patients.insertOne(doc);
//       return res.status(201).json({ message: 'Account created', id: result.insertedId });
//     } catch (e) {
//       if (e && (e.code === 11000 || String(e.message || '').includes('E11000'))) {
//         return res.status(409).json({ message: 'Username already exists' });
//       }
//       console.error('Insert error:', e?.message || e);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//   } catch (e) {
//     console.error('Signup error:', e?.message || e);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Minimal profile
// app.get('/api/patient-profile', async (req, res) => {
//   try {
//     const login = String(req.query.login ?? '').trim();
//     if (!login) return res.status(400).json({ message: 'Missing login' });
//     if (!patients) return res.status(503).json({ message: 'Database not ready' });

//     const doc = await patients.findOne(
//       { login },
//       { projection: { _id: 0, fullName: 1, dob: 1 } }
//     );
//     if (!doc) return res.status(404).json({ message: 'Not found' });

//     return res.status(200).json(doc);
//   } catch (e) {
//     console.error('Profile fetch error:', e?.message || e);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Add this endpoint to your existing app.js

// app.put('/api/patient-update', async (req, res) => {
//   try {
//     const body = req.body || {};
//     const login = String(body.login ?? '').trim();
//     if (!login) return res.status(400).json({ message: 'Missing login' });
//     if (!patients) return res.status(503).json({ message: 'Database not ready' });

//     // Whitelist fields that can be updated
//     const updatable = {
//       fullName: 'string',
//       dob: 'string', // DD/MM/YYYY
//       gender: 'string',
//       address: 'string',
//       primaryPhone: 'string',
//       altPhone: 'string',
//       email: 'string',
//       govId: 'string',
//       language: 'string',

//       allergies: 'string',
//       conditions: 'string',
//       chronicMeds: 'string',
//       primaryDoctor: 'string',
//       pharmacy: 'string',
//       bloodGroup: 'string',

//       consentResearch: 'string', // 'Yes' | 'No'
//       telemedicine: 'string',    // 'Yes' | 'No'
//       otpLogin: 'boolean',
//       twoFA: 'boolean',
//     };

//     const $set = {};
//     for (const [k, t] of Object.entries(updatable)) {
//       if (Object.prototype.hasOwnProperty.call(body, k)) {
//         if (t === 'boolean') {
//           $set[k] = Boolean(body[k]);
//         } else if (typeof body[k] === 'string') {
//           $set[k] = body[k].trim();
//         }
//       }
//     }
//     $set.updatedAt = new Date();

//     const result = await patients.updateOne({ login }, { $set });
//     if (result.matchedCount === 0) return res.status(404).json({ message: 'Not found' });

//     return res.status(200).json({ ok: true });
//   } catch (e) {
//     console.error('Update error:', e?.message || e);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });


// // Full profile (excludes password)
// app.get('/api/patient-full-profile', async (req, res) => {
//   try {
//     const login = String(req.query.login ?? '').trim();
//     if (!login) return res.status(400).json({ message: 'Missing login' });
//     if (!patients) return res.status(503).json({ message: 'Database not ready' });

//     const doc = await patients.findOne(
//       { login },
//       { projection: { password: 0, _id: 0 } }
//     );
//     if (!doc) return res.status(404).json({ message: 'Not found' });

//     return res.status(200).json(doc);
//   } catch (e) {
//     console.error('Full profile fetch error:', e?.message || e);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Patient details (with generated patientId if missing)
// app.get('/api/patient-details', async (req, res) => {
//   try {
//     const login = String(req.query.login ?? '').trim();
//     if (!login) return res.status(400).json({ message: 'Missing login' });
//     if (!patients) return res.status(503).json({ message: 'Database not ready' });

//     let doc = await patients.findOne({ login });
//     if (!doc) return res.status(404).json({ message: 'Not found' });

//     if (!doc.patientId) {
//       const patientId = Math.floor(100000 + Math.random() * 900000).toString();
//       await patients.updateOne({ login }, { $set: { patientId } });
//       doc.patientId = patientId;
//     }

//     const { password, _id, ...safeDoc } = doc;
//     return res.status(200).json(safeDoc);
//   } catch (e) {
//     console.error('Patient details fetch error:', e?.message || e);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Login (all user types)
// app.post('/api/login', async (req, res) => {
//   try {
//     const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
//     if (error) {
//       return res.status(400).json({
//         message: 'Validation failed',
//         details: error.details.map((d) => d.message),
//       });
//     }

//     const { userType, username, password } = value;
//     const col = getCollectionByUserType(userType);
//     if (!col) return res.status(404).json({ message: 'Unknown user type' });

//     let query;
//     if (userType === 'Patient') {
//       query = { login: username };
//     } else {
//       query = {
//         $or: [
//           { login: username },
//           { username },
//           { email: username },
//           { primaryPhone: username },
//         ],
//       };
//     }

//     const user = await col.findOne(query);
//     if (!user) return res.status(401).json({ message: 'Account does not exist or wrong password' });

//     if (typeof user.password !== 'string' || user.password !== password) {
//       return res.status(401).json({ message: 'Account does not exist or wrong password' });
//     }

//     const safeUser = {
//       id: user._id,
//       userType,
//       name: user.fullName || user.name || null,
//       login: user.login || user.username || user.email || null,
//     };

//     return res.status(200).json({ message: 'Login successful', user: safeUser });
//   } catch (e) {
//     console.error('Login error:', e?.message || e);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Global guards
// process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
// process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));

// // Start
// const port = process.env.PORT || 4000;
// app.listen(port, async () => {
//   try {
//     await start();
//     console.log(`API listening on port ${port}`);
//   } catch (err) {
//     console.error('Startup error:', err?.message || err);
//     process.exit(1);
//   }
// });


// app.js — adds doctors collection + doctor registration route, keeps existing routes unchanged

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Config
const uri = process.env.ATLAS_URI;
const dbName = process.env.DB_NAME || 'gramcare';
const patientsCollectionName = process.env.COLLECTION_NAME || 'patients';
const doctorsCollectionName = process.env.DOCTORS_COLLECTION || 'doctors';
const appointmentCollectionName = process.env.APPOINTMENT_COLLECTION || 'appointments';

if (!uri) {
  console.error('Missing ATLAS_URI in .env');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  tls: true,
});

let db;
let patients;
let doctors;
let appointments;


// Validation schemas (existing patient signup + login preserved)
const signupSchema = Joi.object({
  fullName: Joi.string().min(2).max(120).required(),
  dob: Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').allow(null, ''),
  address: Joi.string().min(4).max(500).required(),
  primaryPhone: Joi.string().min(7).max(20).required(),
  altPhone: Joi.string().allow('', null),
  email: Joi.string().email({ tlds: { allow: false } }).allow('', null),
  govId: Joi.string().min(3).max(80).required(),
  language: Joi.string().min(2).max(40).allow(null, ''),
  emergencyName: Joi.string().min(2).max(120).required(),
  emergencyPhone: Joi.string().min(7).max(20).required(),
  conditions: Joi.string().allow('', null),

  // Optional extras used by profile screen
  allergies: Joi.string().allow('', null),
  chronicMeds: Joi.string().allow('', null),
  vitals: Joi.string().allow('', null),
  bloodGroup: Joi.string().allow('', null),
  pharmacy: Joi.string().allow('', null),
  primaryDoctor: Joi.string().allow('', null),
  consentTreatment: Joi.string().allow('', null),
  consentResearch: Joi.string().allow('', null),
  insuranceProvider: Joi.string().allow('', null),
  policyNumber: Joi.string().allow('', null),
  device: Joi.string().allow('', null),
  lastSync: Joi.string().allow('', null),

  login: Joi.string().min(3).max(120).required(),
  password: Joi.string().min(6).max(200).required(),
  agreePolicy: Joi.boolean().valid(true).required(),
});

// New: Doctor registration schema to match Flutter DoctorRegistrationPage
const doctorRegisterSchema = Joi.object({
  fullName: Joi.string().min(2).max(120).required(),
  dateOfBirth: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(), // yyyy-mm-dd incoming from client
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  medicalRegNo: Joi.string().min(3).max(80).required(),
  qualifications: Joi.string().min(2).max(200).required(),
  specialization: Joi.string().min(2).max(100).required(),
  experience: Joi.number().integer().min(0).max(80).required(),
  mobileNumber: Joi.string().min(7).max(20).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).max(200).required(),
  confirmPassword: Joi.string().min(6).max(200).required(),
});

// Appointment validation schema
const appointmentSchema = Joi.object({
  patientLogin: Joi.string().required(),
  doctorId: Joi.string().required(),
  doctorName: Joi.string().required(),
  doctorSpecialty: Joi.string().required(),
  appointmentDate: Joi.string().required(),
  appointmentTime: Joi.string().required(),
  slotLabel: Joi.string().required(),
  mode: Joi.string().required(),
  // REMOVE createdAt — handle on server side
});


const loginSchema = Joi.object({
  userType: Joi.string()
    .valid('Patient', 'Doctor', 'Pharmacy', 'HealthWorker', 'GovernmentOfficial', 'Admin')
    .required(),
  username: Joi.string().min(1).max(200).required(),
  password: Joi.string().min(1).max(200).required(),
  remember: Joi.boolean().optional(),
});

// Helpers
function getCollectionByUserType(type) {
  switch (type) {
    case 'Patient': return db.collection('patients');
    case 'Doctor': return db.collection(doctorsCollectionName);
    case 'Pharmacy': return db.collection('pharmacies');
    case 'HealthWorker': return db.collection('healthworkers');
    case 'GovernmentOfficial': return db.collection('governmentofficials');
    case 'Admin': return db.collection('admins');
    default: return null;
  }
}

async function start() {
  await client.connect();
  db = client.db(dbName);
  appointments = db.collection(appointmentCollectionName);
  patients = db.collection(patientsCollectionName);
  doctors = db.collection(doctorsCollectionName);
  


  // Indexes
  try {
    await patients.createIndex({ login: 1 }, { unique: true });
    console.log('Ensured unique index on patients.login');
  } catch (e) {
    console.warn('WARNING: Could not create unique index on patients.login:', e?.message || e);
  }

  // Doctors unique indexes
  try {
    await doctors.createIndex({ medicalRegNo: 1 }, { unique: true });
    await doctors.createIndex({ email: 1 }, { unique: true });
    console.log('Ensured unique indexes on doctors.medicalRegNo and doctors.email');
  } catch (e) {
    console.warn('WARNING: Could not create unique indexes on doctors:', e?.message || e);
  }

  console.log('Connected to MongoDB Atlas');
}

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// Username availability for patients (existing)
app.get('/api/patient-username-available', async (req, res) => {
  try {
    const login = String(req.query.login ?? '').trim();
    if (!login) return res.status(200).json({ available: false });
    const exists = await patients.findOne({ login });
    return res.status(200).json({ available: !exists });
  } catch (e) {
    console.error('Availability check error:', e?.message || e);
    return res.status(200).json({ available: false });
  }
});

app.post('/api/appointment', async (req, res) => {
  
  if (!appointments) {
    return res.status(503).json({ success: false, message: "Appointments collection is not initialized." });
  }
  
  try {
    
    const { error, value } = appointmentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      console.log("Validation error details:", error.details, "Request body:", req.body);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map((d) => d.message),
      });
    }
    value.createdAt = new Date(); // Set here on server!
    await appointments.insertOne(value);
    res.status(201).json({ success: true, message: 'Appointment booked' });
  } catch (e) {
  console.error("Appointment insert error:", e);
  res.status(500).json({ success: false, message: 'Internal server error', error: e?.message || e });
}
});


app.get('/api/appointments', async (req, res) => {
  try {
    const patientLogin = String(req.query.patientLogin ?? '').trim();
    if (!patientLogin) return res.status(400).json({ message: 'Missing patientLogin' });
    const items = await appointments
      .find({ patientLogin }, { projection: { _id: 0 } })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .toArray();
    res.status(200).json({ appointments: items });
  } catch (e) {
    console.error('Fetch appointments error:', e?.message || e);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Patient signup (existing)
app.post('/api/patientsigin', async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        details: error.details.map((d) => d.message),
      });
    }

    const existing = await patients.findOne({ login: value.login });
    if (existing) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const now = new Date();
    const doc = { ...value, createdAt: now, updatedAt: now };

    try {
      const result = await patients.insertOne(doc);
      return res.status(201).json({ message: 'Account created', id: result.insertedId });
    } catch (e) {
      if (e && (e.code === 11000 || String(e.message || '').includes('E11000'))) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      console.error('Insert error:', e?.message || e);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } catch (e) {
    console.error('Signup error:', e?.message || e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Minimal patient profile (existing)
app.get('/api/patient-profile', async (req, res) => {
  try {
    const login = String(req.query.login ?? '').trim();
    if (!login) return res.status(400).json({ message: 'Missing login' });
    if (!patients) return res.status(503).json({ message: 'Database not ready' });

    const doc = await patients.findOne(
      { login },
      { projection: { _id: 0, fullName: 1, dob: 1 } }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });

    return res.status(200).json(doc);
  } catch (e) {
    console.error('Profile fetch error:', e?.message || e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Patient update (existing)
app.put('/api/patient-update', async (req, res) => {
  try {
    const body = req.body || {};
    const login = String(body.login ?? '').trim();
    if (!login) return res.status(400).json({ message: 'Missing login' });
    if (!patients) return res.status(503).json({ message: 'Database not ready' });

    const updatable = {
      fullName: 'string',
      dob: 'string',
      gender: 'string',
      address: 'string',
      primaryPhone: 'string',
      altPhone: 'string',
      email: 'string',
      govId: 'string',
      language: 'string',
      allergies: 'string',
      conditions: 'string',
      chronicMeds: 'string',
      primaryDoctor: 'string',
      pharmacy: 'string',
      bloodGroup: 'string',
      consentResearch: 'string',
      telemedicine: 'string',
      otpLogin: 'boolean',
      twoFA: 'boolean',
    };

    const $set = {};
    for (const [k, t] of Object.entries(updatable)) {
      if (Object.prototype.hasOwnProperty.call(body, k)) {
        if (t === 'boolean') $set[k] = Boolean(body[k]);
        else if (typeof body[k] === 'string') $set[k] = body[k].trim();
      }
    }
    $set.updatedAt = new Date();

    const result = await patients.updateOne({ login }, { $set });
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Not found' });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Update error:', e?.message || e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Full patient profile (existing)
app.get('/api/patient-full-profile', async (req, res) => {
  try {
    const login = String(req.query.login ?? '').trim();
    if (!login) return res.status(400).json({ message: 'Missing login' });
    if (!patients) return res.status(503).json({ message: 'Database not ready' });

    const doc = await patients.findOne(
      { login },
      { projection: { password: 0, _id: 0 } }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });

    return res.status(200).json(doc);
  } catch (e) {
    console.error('Full profile fetch error:', e?.message || e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Patient details (existing, also generates patientId)
app.get('/api/patient-details', async (req, res) => {
  try {
    const login = String(req.query.login ?? '').trim();
    if (!login) return res.status(400).json({ message: 'Missing login' });
    if (!patients) return res.status(503).json({ message: 'Database not ready' });

    let doc = await patients.findOne({ login });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    if (!doc.patientId) {
      const patientId = Math.floor(100000 + Math.random() * 900000).toString();
      await patients.updateOne({ login }, { $set: { patientId } });
      doc.patientId = patientId;
    }

    const { password, _id, ...safeDoc } = doc;
    return res.status(200).json(safeDoc);
  } catch (e) {
    console.error('Patient details fetch error:', e?.message || e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// New: Doctor registration route
app.post('/api/doctor/register', async (req, res) => {
  try {
    const { error, value } = doctorRegisterSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map((d) => d.message),
      });
    }

    if (value.password !== value.confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match' });
    }

    // Uniqueness checks
    const dupReg = await doctors.findOne({ medicalRegNo: value.medicalRegNo });
    if (dupReg) return res.status(409).json({ success: false, error: 'Medical registration number already exists' });

    const dupEmail = await doctors.findOne({ email: value.email.toLowerCase() });
    if (dupEmail) return res.status(409).json({ success: false, error: 'Email already exists' });

    const now = new Date();
    const doc = {
      fullName: value.fullName,
      dateOfBirth: value.dateOfBirth, // yyyy-mm-dd
      gender: value.gender,
      medicalRegNo: value.medicalRegNo,
      qualifications: value.qualifications,
      specialization: value.specialization,
      experience: value.experience,
      mobileNumber: value.mobileNumber,
      email: value.email.toLowerCase(),
      // NOTE: replace with bcrypt hash in production
      password: value.password,
      isVerified: false,
      rating: null,
      reviews: 0,
      createdAt: now,
      updatedAt: now,
    };

    const result = await doctors.insertOne(doc);

    // Minimal response; token/JWT issuance can be added later
    const safeDoctor = {
      id: result.insertedId,
      fullName: doc.fullName,
      specialization: doc.specialization,
      medicalRegNo: doc.medicalRegNo,
      email: doc.email,
    };

    return res.status(201).json({
      success: true,
      message: 'Doctor registered',
      doctor: safeDoctor,
      token: null, // supply JWT later if needed
    });
  } catch (e) {
    if (e && (e.code === 11000 || String(e.message || '').includes('E11000'))) {
      return res.status(409).json({ success: false, error: 'Duplicate key' });
    }
    console.error('Doctor register error:', e?.message || e);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Fetch doctors list with optional search
app.get('/api/doctors', async (req, res) => {
  try {
    if (!doctors) return res.status(503).json({ message: 'Database not ready' });

    const { q } = req.query;
    let query = {};
    if (q) {
      // Search by name or specialization, case-insensitive
      query = {
        $or: [
          { fullName: { $regex: q, $options: 'i' } },
          { specialization: { $regex: q, $options: 'i' } },
        ],
      };
    }
    // Only fetch safe fields for frontend
    const projection = { password: 0, _id: 0 };
    const doctorList = await doctors.find(query, { projection }).toArray();
    res.json({ doctors: doctorList });
  } catch (e) {
    console.error('Fetch doctors error:', e?.message || e);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add this new route to your app.js file
app.patch('/api/appointment/update', async (req, res) => {
  if (!appointments) {
    return res.status(503).json({ success: false, message: "Appointments collection is not initialized." });
  }
  
  try {
    const { patientLogin, doctorId, appointmentDate, appointmentTime, status } = req.body;
    
    // Validate required fields
    if (!patientLogin || !doctorId || !appointmentDate || !appointmentTime || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patientLogin, doctorId, appointmentDate, appointmentTime, status'
      });
    }

    // Find and update the appointment
    const filter = {
      patientLogin,
      doctorId,
      appointmentDate,
      appointmentTime
    };

    const update = {
      $set: {
        status: status,
        updatedAt: new Date()
      }
    };

    const result = await appointments.updateOne(filter, update);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({
        success: true,
        message: 'Appointment already has the requested status'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully'
    });

  } catch (e) {
    console.error("Appointment update error:", e);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: e?.message || e
    });
  }
});


// Login (existing, supports userType switching)
app.post('/api/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        details: error.details.map((d) => d.message),
      });
    }

    const { userType, username, password } = value;
    const col = getCollectionByUserType(userType);
    if (!col) return res.status(404).json({ message: 'Unknown user type' });

    let query;
    if (userType === 'Patient') {
      query = { login: username };
    } else if (userType === 'Doctor') {
      // Allow login by email or medicalRegNo
      query = {
        $or: [
          { email: String(username).toLowerCase() },
          { medicalRegNo: username },
        ],
      };
    } else {
      query = {
        $or: [
          { login: username },
          { username },
          { email: username },
          { primaryPhone: username },
        ],
      };
    }

    const user = await col.findOne(query);
    if (!user) {
      return res.status(401).json({ message: 'Account does not exist or wrong password' });
    }

    // Plain-text compare for parity with existing behavior
    if (typeof user.password !== 'string' || user.password !== password) {
      return res.status(401).json({ message: 'Account does not exist or wrong password' });
    }

    const safeUser = {
      id: user._id,
      userType,
      name: user.fullName || user.name || null,
      login: user.login || user.username || user.email || null,
    };

    return res.status(200).json({ message: 'Login successful', user: safeUser });
  } catch (e) {
    console.error('Login error:', e?.message || e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Global guards
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));

// Start
const port = process.env.PORT || 4001;
app.listen(port, async () => {
  try {
    await start();
 console.log(`API listening on port ${port}`);
  } catch (err) {
    console.error('Startup error:', err?.message || err);
    process.exit(1);
  }
});

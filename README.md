# RadioOneAI - Unified Radiology Platform

The RadioOneAI Frontend is a modern, responsive web interface designed to support real clinical workflows in radiology. It acts as the primary interaction layer between radiographers, radiologists, doctors, patients, receptionists, administrators, and AI services.

The frontend focuses on clarity, safety, and workflow efficiency, ensuring that AI outputs are presented strictly as clinical decision support and not as replacements for medical professionals.

---

## Key Objectives

- Provide a user-centered clinical workflow  
- Reduce reporting and communication delays  
- Present AI results in an interpretable and editable manner  
- Support human-in-the-loop validation  
- Enable urgency-based prioritization and alerts  

---

## User Dashboards

The platform provides role-based dashboards aligned with real hospital workflows:

- Radiographer Dashboard  
  Upload MRI scans, flag urgent or critical cases, initiate AI analysis  

- Radiologist Workspace  
  Review AI-generated pre-reports, receive AI-suggested guidance, edit and approve reports  

- Doctor View  
  Access validated reports and view clinical recommendations  

- Patient View  
  View patient-friendly summaries to reduce anxiety  

- Receptionist Dashboard  
  Manage patients, prescriptions, and radiology appointments  

- Admin Dashboard  
  Manage users, monitor platform activity, and control system traffic  

---

## Tech Stack

- React.js (with Vite)  
- DaisyUI  
- Flask (backend integration)  

---

## Project Setup Guide (Frontend)

### Step 1: Install Prerequisites

Install the following tools before starting:

- Node.js (v18 or higher recommended)  
- npm or yarn  
- Git  

Check installed versions:

```bash
node -v
npm -v
git --version


01. Make sure you have the following installed:
    * Node.js (v18 or higher recommended)
    * npm or yarn
    * Git

02. Check versions:
  * node -v
  * npm -v

03. Clone Repository
  * git clone https://github.com/Work-Pulse/Work-Pulse-Frontend.git
  * cd .\radio-one-ai\

04. Install Dependencies
  * npm install

05. Run the Development Server
  * npm run dev

06. The app will be available at: http://localhost:5173

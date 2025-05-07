
# 💻 CPUFlow – Interactive CPU Scheduler Simulator

**CPUFlow** is an interactive web app that visualizes CPU scheduling algorithms like FCFS, SJF, Priority, and Round Robin. It features a dynamic Gantt chart, dark/light mode, and export options (CSV, PDF, Image) to make learning OS concepts easy and engaging.

- 🟢 FCFS (First-Come-First-Serve)
- 🔵 SJF (Shortest Job First – Preemptive & Non-preemptive)
- 🟡 Priority Scheduling (Preemptive & Non-preemptive)
- 🔴 Round Robin (with customizable time quantum)

---

## 🚀 Features

- 🎨 **Intuitive UI** – Built with React.js & Bootstrap for responsive layout and smooth animations.
- 📊 **Gantt Chart Visualization** – Simulates and renders real-time Gantt charts.
- 🌓 **Dark/Light Theme Toggle** – Seamless switch between dark and light modes.
- 📁 **Export Options** – Download results as:
  - CSV
  - PDF
  - 📷 PNG Image (Gantt Chart)
- 📉 **Real-Time Averages** – Calculates average Waiting Time and Turnaround Time.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Utilities:** jsPDF, FileSaver, html2canvas

---

## 📸 Demo

![CPUFlow Screenshot](https://your-screenshot-link-if-you-have-one.png)

---

## 🔗 Live Demo & Source

- 🌐 [Live Demo](https://your-deployment-link.com)  
- 📦 [Source Code (GitHub)](https://github.com/itzshashi07/CPUFlow)

---

## 📂 Folder Structure

CPUFlow/
├── client/ # React frontend
│ ├── src/
│ └── public/
├── server/ # Node + Express backend
│ └── index.js
├── package.json
├── README.md




---

## 📦 Installation

```bash
# 1. Clone the repo
git clone https://github.com/itzshashi07/CPUFlow.git

# 2. Navigate to project folder
cd CPUFlow

# 3. Install backend dependencies
cd server
npm install

# 4. Start backend server
node index.js

# 5. Run frontend
cd ../client
npm install
npm start

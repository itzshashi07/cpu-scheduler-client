import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as htmlToImage from 'html-to-image';
import './App.css';


function App() {
  const [processes, setProcesses] = useState([{ id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 }]);
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [preemptive, setPreemptive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');

  const ganttRef = useRef();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  const handleAddProcess = () => {
    setProcesses([...processes, { id: `P${processes.length + 1}`, arrivalTime: 0, burstTime: 1, priority: 1 }]);
  };

  const handleChange = (index, field, value) => {
    const newProcs = [...processes];
    newProcs[index][field] = field === 'id' ? value : parseInt(value);
    setProcesses(newProcs);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await axios.post('https://server-cpu.onrender.com/simulate', {
        processes,
        algorithm,
        preemptive,
        timeQuantum: algorithm === 'RR' ? timeQuantum : undefined,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Simulation failed');
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    if (!result) return;

    const headers = ['ID', 'Start Time', 'End Time', 'Waiting Time', 'Turnaround Time'];
    const rows = result.processes.map(p => [p.id, p.startTime, p.endTime, p.waitingTime, p.turnaroundTime]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'cpu_scheduling_result.csv');
  };

  const exportToPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    doc.text('CPU Scheduling Simulation Result', 14, 10);

    const tableColumn = ['ID', 'Start Time', 'End Time', 'Waiting Time', 'Turnaround Time'];
    const tableRows = result.processes.map(p => [p.id, p.startTime, p.endTime, p.waitingTime, p.turnaroundTime]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('cpu_scheduling_result.pdf');
  };

  const exportGanttAsImage = () => {
    if (!ganttRef.current) return;
  
    htmlToImage.toPng(ganttRef.current, {
      backgroundColor: '#ffffff', // force white background
      pixelRatio: 2               // higher resolution image
    })
    .then(dataUrl => {
      const link = document.createElement('a');
      link.download = 'gantt_chart.png';
      link.href = dataUrl;
      link.click();
    })
    .catch(err => {
      console.error('Error exporting Gantt chart:', err);
    });
  };
  

  return (
    <div className={`container py-5 ${theme}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>CPU Scheduler</h1>
        <button className="btn btn-outline-secondary" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>

      <div className="card p-4 mb-4 shadow-sm">
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">Algorithm:</label>
          <div className="col-sm-10">
            <select className="form-select" value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
              <option value="FCFS">FCFS</option>
              <option value="SJF">SJF</option>
              <option value="Priority">Priority</option>
              <option value="RR">Round Robin</option>
            </select>
          </div>
        </div>

        {(algorithm === 'SJF' || algorithm === 'Priority') && (
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={preemptive}
              onChange={e => setPreemptive(e.target.checked)}
            />
            <label className="form-check-label">Preemptive</label>
          </div>
        )}

        {algorithm === 'RR' && (
          <div className="mb-3">
            <label>Time Quantum</label>
            <input
              type="number"
              className="form-control"
              value={timeQuantum}
              onChange={e => setTimeQuantum(parseInt(e.target.value))}
            />
          </div>
        )}

        <h5>Process List:</h5>
        {processes.map((proc, idx) => (
          <div key={idx} className="row mb-2 g-2">
            <div className="col-md-2">
              <input value={proc.id} onChange={e => handleChange(idx, 'id', e.target.value)} className="form-control" placeholder="ID" />
            </div>
            <div className="col-md-2">
              <input type="number" value={proc.arrivalTime} onChange={e => handleChange(idx, 'arrivalTime', e.target.value)} className="form-control" placeholder="Arrival" />
            </div>
            <div className="col-md-2">
              <input type="number" value={proc.burstTime} onChange={e => handleChange(idx, 'burstTime', e.target.value)} className="form-control" placeholder="Burst" />
            </div>
            {algorithm === 'Priority' && (
              <div className="col-md-2">
                <input type="number" value={proc.priority} onChange={e => handleChange(idx, 'priority', e.target.value)} className="form-control" placeholder="Priority" />
              </div>
            )}
          </div>
        ))}

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-outline-primary" onClick={handleAddProcess}>Add Process</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Simulate'}
          </button>
        </div>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>

      {result && (
        <div className="card p-4 shadow-sm">
          <h4>Result Table</h4>
          <table className="table table-bordered mt-3">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Start</th>
                <th>End</th>
                <th>Waiting</th>
                <th>Turnaround</th>
              </tr>
            </thead>
            <tbody>
              {result.processes.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.startTime}</td>
                  <td>{p.endTime}</td>
                  <td>{p.waitingTime}</td>
                  <td>{p.turnaroundTime}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3">
            <strong>Average Waiting Time:</strong> {result.averageWaitingTime.toFixed(2)}<br />
            <strong>Average Turnaround Time:</strong> {result.averageTurnaroundTime.toFixed(2)}
          </div>

          <div className="mt-4">
            <h5>Gantt Chart:</h5>
            <div
        className="d-flex gap-2 overflow-auto p-3 rounded"
        ref={ganttRef}
        style={{ background: theme === 'dark' ? '#333' : '#f1f1f1' }}
         >
        {result.processes.map(p => (
       <div key={p.id} className="bg-success text-white px-3 py-2 rounded text-center">
      {p.id} ({p.startTime}-{p.endTime})
      </div>
      ))}
</div>


            <div className="d-flex flex-wrap gap-2 mt-3">
              <button className="btn btn-success" onClick={exportToCSV}>Export CSV</button>
              <button className="btn btn-danger" onClick={exportToPDF}>Export PDF</button>
              <button className="btn btn-warning" onClick={exportGanttAsImage}>📷 Export Gantt Image</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

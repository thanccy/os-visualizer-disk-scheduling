# os-visualizer-disk-scheduling# OS Scheduling Visualizer

## 1. Project Description

The OS Scheduling Visualizer is a web-based application developed using HTML, CSS and JavaScript. It helps students understand and visualize different Operating System scheduling algorithms through interactive graphs and charts.

The project demonstrates how operating systems manage disk requests and CPU processes using different scheduling techniques.

## 2. Objectives

- To understand disk scheduling algorithms.
- To visualize disk head movement.
- To understand CPU scheduling algorithms.
- To calculate waiting time and turnaround time.
- To compare the performance of different scheduling algorithms.
- To provide an interactive learning experience for students.

## 3. Technologies Used

- **HTML5** – Structure of the application.
- **CSS3** – Styling and responsive design.
- **JavaScript** – Scheduling algorithms and calculations.
- **HTML Canvas** – Graph visualization.

## 4. Features

### Part A: Disk Scheduling

The application implements five disk scheduling algorithms:

1. FCFS (First Come First Serve)
2. SSTF (Shortest Seek Time First)
3. SCAN
4. C-SCAN (Circular SCAN)
5. LOOK

**Features:**
- Enter disk size.
- Enter initial head position.
- Enter disk request queue.
- Select disk head direction.
- View service sequence.
- Calculate total head movement.
- View disk movement graph.
- Previous and Next step controls.
- Auto-play animation.
- Compare all five algorithms using a bar chart.

### Part B: CPU Scheduling

The application implements two CPU scheduling algorithms:

1. FCFS (First Come First Serve)
2. Round Robin

**Features:**
- Add processes.
- Enter process ID.
- Enter arrival time.
- Enter burst time.
- Set time quantum for Round Robin.
- Generate Gantt chart.
- Calculate completion time.
- Calculate waiting time.
- Calculate turnaround time.
- Calculate average waiting and turnaround times.
- Step-by-step Gantt chart animation.

## 5. Project Structure

```text
OS_Scheduling_Visualizer/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 6. Installation and Execution

### Step 1: Download the Project

Download or clone the project from GitHub.

### Step 2: Open in VS Code

Open Visual Studio Code and select the project folder.

### Step 3: Run the Application

Open `index.html` in the browser.

Alternatively, install the Live Server extension in VS Code.

Right-click on `index.html` and select **Open with Live Server**.

The application will open in your default browser.

## 7. Sample Input – Disk Scheduling

| Parameter | Value |
|---|---|
| Disk Size | 200 |
| Initial Head Position | 50 |
| Request Queue | 82, 170, 43, 140, 24, 16, 190 |
| Direction | Right |

### Expected Output

| Algorithm | Total Head Movement |
|---|---:|
| FCFS | 642 |
| SSTF | 208 |

Other algorithm results depend on the selected direction and disk boundaries.

## 8. Sample Input – CPU Scheduling

| Process | Arrival Time | Burst Time |
|---|---:|---:|
| P1 | 0 | 5 |
| P2 | 1 | 3 |
| P3 | 2 | 4 |

Time Quantum for Round Robin: 2

The application displays the Gantt chart and calculates completion time, waiting time and turnaround time for each process.

## 9. Advantages

- Easy to understand scheduling algorithms.
- Interactive and user-friendly interface.
- Visual representation of disk head movement.
- Helps compare scheduling algorithms.
- Reduces the difficulty of understanding theoretical concepts.
- Can be accessed through a web browser.

## 10. Limitations

- Only selected disk and CPU scheduling algorithms are implemented.
- The application runs in a web browser.
- Results are limited to the algorithms included in the project.
- It does not simulate actual operating system hardware.

## 11. Future Enhancements

- Add SJF scheduling.
- Add SRTF scheduling.
- Add Priority scheduling.
- Add more interactive animations.
- Provide downloadable performance reports.
- Improve graph visualization.
- Add more scheduling algorithms.

## 12. Conclusion

The OS Scheduling Visualizer provides an interactive platform for understanding operating system scheduling algorithms. It demonstrates disk and CPU scheduling through graphs, charts and calculated results.

This project helps students understand the working principles and performance of different scheduling algorithms in a simple and effective way.

## 13. Author

**Project Name:** OS Scheduling Visualizer

**Course:**


// SWITCH BETWEEN DISK AND CPU

function showDisk() {
    document.getElementById("diskSection").style.display = "block";
    document.getElementById("cpuSection").style.display = "none";
}

function showCPU() {
    document.getElementById("diskSection").style.display = "none";
    document.getElementById("cpuSection").style.display = "block";
}


// DISK SCHEDULING

let diskPath = [];
let diskStep = 0;
let diskTimer = null;
let diskMax = 200;

function getDiskInput() {

    let max = Number(document.getElementById("diskSize").value);
    let head = Number(document.getElementById("head").value);

    let requests = document.getElementById("requests").value
        .split(",").map(Number);

    if (!Number.isInteger(max) || max < 2 ||
        !Number.isInteger(head) || head < 0 || head >= max ||
        requests.some(x => !Number.isInteger(x) || x < 0 || x >= max) ||
        requests.length === 0) {
        throw new Error("Enter valid disk size, head and requests.");
    }

    return { max, head, requests };
}


function calculateDisk(name, data, direction) {

    let { max, head, requests } = data;

    let remaining = requests.map((v, i) => ({v, i}));
    let sequence = [];
    let path = [head];

    function add(item) {
        sequence.push(item.v);
        path.push(item.v);
        remaining = remaining.filter(x => x.i !== item.i);
    }

    if (name === "FCFS") {
        remaining.forEach(add);
    }

    else if (name === "SSTF") {

        let current = head;

        while (remaining.length > 0) {

            remaining.sort((a, b) =>
                Math.abs(a.v - current) -
                Math.abs(b.v - current) || a.i - b.i
            );

            let item = remaining[0];

            add(item);
            current = item.v;
        }
    }

    else {

        let left = remaining
            .filter(x => x.v < head)
            .sort((a, b) => b.v - a.v);

        let right = remaining
            .filter(x => x.v >= head)
            .sort((a, b) => a.v - b.v);

        let first = direction === "right" ? right : left;
        let second = direction === "right" ? left : right;

        first.forEach(add);

        if (name === "SCAN") {

            let edge = direction === "right" ? max - 1 : 0;

            if (path[path.length - 1] !== edge) {
                path.push(edge);
            }
        }

        if (name === "CSCAN") {

            let edge = direction === "right" ? max - 1 : 0;
            let opposite = direction === "right" ? 0 : max - 1;

            if (path[path.length - 1] !== edge) {
                path.push(edge);
            }

            path.push(opposite);
        }

        second.forEach(add);
    }

    let movement = 0;

    for (let i = 1; i < path.length; i++) {
        movement += Math.abs(path[i] - path[i - 1]);
    }

    return { sequence, path, movement };
}


function runDisk() {

    try {

        clearInterval(diskTimer);
        diskTimer = null;

        let data = getDiskInput();

        diskMax = data.max;

        let name = document.getElementById("algorithm").value;
        let direction = document.getElementById("direction").value;

        let result = calculateDisk(name, data, direction);

        diskPath = result.path;
        diskStep = 0;

        document.getElementById("sequence").innerHTML =
            "Service Sequence: " +
            [data.head, ...result.sequence].join(" → ");

        document.getElementById("movement").innerHTML =
            "Total Head Movement: " + result.movement;

        document.getElementById("diskError")?.remove();

        drawDisk();
    }
    catch(error) {
        alert(error.message);
    }
}


// DRAW DISK GRAPH

function drawDisk() {

    let canvas = document.getElementById("diskCanvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (diskPath.length === 0) return;

    let max = diskMax - 1;

    let x = i => 45 + i * (canvas.width - 85) /
        Math.max(1, diskPath.length - 1);

    let y = value => 20 + (max - value) *
        (canvas.height - 65) / max;

    ctx.strokeStyle = "#dddddd";
    ctx.font = "12px Arial";

    for (let i = 0; i <= 4; i++) {

        let value = Math.round(max - max * i / 4);
        let yy = y(value);

        ctx.beginPath();
        ctx.moveTo(40, yy);
        ctx.lineTo(canvas.width - 20, yy);
        ctx.stroke();

        ctx.fillStyle = "#333";
        ctx.fillText(value, 5, yy + 4);
    }

    ctx.beginPath();

    diskPath.forEach((value, i) => {

        if (i === 0) {
            ctx.moveTo(x(i), y(value));
        } else {
            ctx.lineTo(x(i), y(value));
        }
    });

    ctx.strokeStyle = "#3563e9";
    ctx.lineWidth = 3;
    ctx.stroke();

    diskPath.forEach((value, i) => {

        ctx.beginPath();
        ctx.arc(x(i), y(value), 5, 0, Math.PI * 2);

        ctx.fillStyle = i <= diskStep ? "#16a6a1" : "#aab8d2";
        ctx.fill();
    });

    document.getElementById("step").innerText =
        "Step: " + diskStep + " / " + (diskPath.length - 1);
}


function nextStep() {

    if (diskStep < diskPath.length - 1) {
        diskStep++;
        drawDisk();
    }
}


function previousStep() {

    if (diskStep > 0) {
        diskStep--;
        drawDisk();
    }
}


function resetDisk() {

    clearInterval(diskTimer);
    diskTimer = null;
    diskStep = 0;
    drawDisk();
}


function autoPlay() {

    if (!diskPath.length) return;

    if (diskTimer) {
        clearInterval(diskTimer);
        diskTimer = null;
        return;
    }

    diskTimer = setInterval(() => {

        if (diskStep >= diskPath.length - 1) {
            clearInterval(diskTimer);
            diskTimer = null;
            return;
        }

        nextStep();

    }, 700);
}


// COMPARE ALL DISK ALGORITHMS

function compareDisk() {

    try {

        let data = getDiskInput();

        let names = ["FCFS", "SSTF", "SCAN", "CSCAN", "LOOK"];

        let values = names.map(name =>
            calculateDisk(
                name,
                data,
                document.getElementById("direction").value
            ).movement
        );

        let canvas = document.getElementById("compareCanvas");
        let ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let max = Math.max(...values) || 1;
        let width = 75;
        let gap = 50;

        names.forEach((name, i) => {

            let height = values[i] / max * 210;
            let x = 35 + i * (width + gap);
            let y = 245 - height;

            ctx.fillStyle = "#3563e9";
            ctx.fillRect(x, y, width, height);

            ctx.fillStyle = "#222";
            ctx.font = "13px Arial";
            ctx.fillText(values[i], x, y - 8);
            ctx.fillText(name, x, 265);
        });

    }
    catch(error) {
        alert(error.message);
    }
}


// CPU SCHEDULING

let processes = [];
let cpuSegments = [];
let cpuStep = 0;
let cpuTimer = null;


function addProcess() {

    let id = document.getElementById("pid").value.trim();
    let arrival = Number(document.getElementById("arrival").value);
    let burst = Number(document.getElementById("burst").value);

    if (!id || processes.some(p => p.id === id) ||
        !Number.isInteger(arrival) || arrival < 0 ||
        !Number.isInteger(burst) || burst <= 0) {

        document.getElementById("cpuError").innerText =
            "Enter a unique ID, valid arrival time and burst time.";

        return;
    }

    processes.push({ id, arrival, burst });

    document.getElementById("cpuError").innerText = "";

    displayProcesses();

    document.getElementById("pid").value = "";
}


function displayProcesses() {

    let table = document.getElementById("processTable");

    table.innerHTML = "";

    processes.forEach((p, index) => {

        let row = table.insertRow();

        row.insertCell(0).innerText = p.id;
        row.insertCell(1).innerText = p.arrival;
        row.insertCell(2).innerText = p.burst;

        let btn = document.createElement("button");
        btn.innerText = "Remove";

        btn.onclick = () => {
            processes.splice(index, 1);
            displayProcesses();
        };

        row.insertCell(3).appendChild(btn);
    });
}


function loadSample() {

    processes = [
        {id: "P1", arrival: 0, burst: 5},
        {id: "P2", arrival: 1, burst: 3},
        {id: "P3", arrival: 2, burst: 4}
    ];

    displayProcesses();
}


// FCFS CPU SCHEDULING

function runFCFS() {

    try {

        if (processes.length === 0) {
            throw new Error("Add at least one process.");
        }

        let list = processes.map(p => ({...p}))
            .sort((a, b) => a.arrival - b.arrival);

        let time = 0;
        cpuSegments = [];

        list.forEach(p => {

            if (time < p.arrival) {
                cpuSegments.push({
                    id: "Idle",
                    start: time,
                    end: p.arrival
                });

                time = p.arrival;
            }

            let start = time;
            time += p.burst;

            cpuSegments.push({
                id: p.id,
                start: start,
                end: time
            });

            p.completion = time;
        });

        calculateMetrics(list);
        startCPU();
    }
    catch(error) {
        alert(error.message);
    }
}


// ROUND ROBIN CPU SCHEDULING

function runRR() {

    try {

        if (processes.length === 0) {
            throw new Error("Add at least one process.");
        }

        let quantum = Number(document.getElementById("quantum").value);

        if (!Number.isInteger(quantum) || quantum <= 0) {
            throw new Error("Enter a valid positive time quantum.");
        }

        let list = processes.map(p => ({
            ...p,
            remaining: p.burst
        })).sort((a, b) => a.arrival - b.arrival);

        let queue = [];
        let time = 0;
        let index = 0;

        cpuSegments = [];

        while (list.some(p => p.remaining > 0)) {

            while (index < list.length &&
                list[index].arrival <= time) {

                queue.push(list[index]);
                index++;
            }

            if (queue.length === 0) {

                let next = list[index];

                cpuSegments.push({
                    id: "Idle",
                    start: time,
                    end: next.arrival
                });

                time = next.arrival;
                continue;
            }

            let p = queue.shift();

            let start = time;
            let run = Math.min(quantum, p.remaining);

            time += run;
            p.remaining -= run;

            cpuSegments.push({
                id: p.id,
                start: start,
                end: time
            });

            while (index < list.length &&
                list[index].arrival <= time) {

                queue.push(list[index]);
                index++;
            }

            if (p.remaining > 0) {
                queue.push(p);
            } else {
                p.completion = time;
            }
        }

        calculateMetrics(list);
        startCPU();

    }
    catch(error) {
        alert(error.message);
    }
}


// CALCULATE WAITING AND TURNAROUND TIME

function calculateMetrics(list) {

    let table = document.getElementById("resultTable");

    table.innerHTML = "";

    let totalWaiting = 0;
    let totalTurnaround = 0;

    list.forEach(p => {

        let tat = p.completion - p.arrival;
        let waiting = tat - p.burst;

        totalWaiting += waiting;
        totalTurnaround += tat;

        let row = table.insertRow();

        row.insertCell(0).innerText = p.id;
        row.insertCell(1).innerText = p.completion;
        row.insertCell(2).innerText = tat;
        row.insertCell(3).innerText = waiting;
    });

    document.getElementById("average").innerText =
        "Average Waiting Time: " +
        (totalWaiting / list.length).toFixed(2) +
        " | Average Turnaround Time: " +
        (totalTurnaround / list.length).toFixed(2);
}


// GANTT CHART ANIMATION

function startCPU() {

    clearInterval(cpuTimer);
    cpuTimer = null;

    cpuStep = 0;

    displayGantt();
}


function displayGantt() {

    let gantt = document.getElementById("gantt");

    gantt.innerHTML = "";

    for (let i = 0; i < cpuStep; i++) {

        let block = document.createElement("div");

        block.className = "gantt-block";

        if (cpuSegments[i].id === "Idle") {
            block.style.background = "#9ca3af";
        }

        block.innerText = cpuSegments[i].id;

        block.title = cpuSegments[i].start +
            " to " + cpuSegments[i].end;

        gantt.appendChild(block);
    }
}


function cpuNext() {

    if (cpuStep < cpuSegments.length) {
        cpuStep++;
        displayGantt();
    }
}


function cpuPrevious() {

    if (cpuStep > 0) {
        cpuStep--;
        displayGantt();
    }
}


function cpuReset() {

    clearInterval(cpuTimer);
    cpuTimer = null;
    cpuStep = 0;
    displayGantt();
}


function cpuAuto() {

    if (!cpuSegments.length) return;

    if (cpuTimer) {
        clearInterval(cpuTimer);
        cpuTimer = null;
        return;
    }

    cpuTimer = setInterval(() => {

        if (cpuStep >= cpuSegments.length) {
            clearInterval(cpuTimer);
            cpuTimer = null;
            return;
        }

        cpuNext();

    }, 700);
}

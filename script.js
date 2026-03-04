let mapData = [];
let currentSize = 20;
let selectedTool = 'road';
let isDrawing = false;


const gridElement = document.getElementById('grid');
const sizeSelect = document.getElementById('size-select');
const tools = document.querySelectorAll('.tool');


tools.forEach(tool => {
    tool.addEventListener('click', () => {
        tools.forEach(t => t.classList.remove('active'));
        tool.classList.add('active');
        selectedTool = tool.dataset.type;
    });
});


document.getElementById('btn-save').addEventListener('click', saveMap);
document.getElementById('btn-exit').addEventListener('click', exitToMenu);
document.getElementById('btn-load-menu').addEventListener('click', loadMap);


window.addEventListener('mouseup', () => isDrawing = false);



function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function startNewMap() {
    currentSize = parseInt(sizeSelect.value);
    initMap(currentSize);
    showScreen('screen-editor');
}

function initMap(size, savedData = null) {
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${size}, 25px)`;
    mapData = [];

    for (let y = 0; y < size; y++) {
        mapData[y] = [];
        for (let x = 0; x < size; x++) {
            const terrain = savedData ? savedData[y][x] : 'grass';
            mapData[y][x] = terrain;

            const tile = document.createElement('div');
            tile.className = `tile ${terrain}`;
            
            tile.addEventListener('mousedown', () => {
                isDrawing = true;
                applyTool(x, y, tile);
            });
            tile.addEventListener('mouseenter', () => {
                if (isDrawing) applyTool(x, y, tile);
            });

            gridElement.appendChild(tile);
        }
    }
}

function applyTool(x, y, element) {
    mapData[y][x] = selectedTool;
    element.className = `tile ${selectedTool}`;
}

function saveMap() {
    const dataToSave = {
        size: currentSize,
        map: mapData
    };
    localStorage.setItem('savedCarTrack', JSON.stringify(dataToSave));
    alert('Mapa byla úspěšně uložena!');
}

function loadMap() {
    const rawData = localStorage.getItem('savedCarTrack');
    if (!rawData) {
        alert('Nebyla nalezena žádná uložená data.');
        return;
    }
    const data = JSON.parse(rawData);
    currentSize = data.size;
    initMap(data.size, data.map);
    showScreen('screen-editor');
}

function exitToMenu() {
    if (confirm('Opravdu chcete odejít do menu? Neuložený postup bude ztracen.')) {
        showScreen('screen-menu');
    }
}
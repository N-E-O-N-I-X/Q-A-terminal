       // Создание сцены, камеры и рендерера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Настройка света
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10).normalize();
scene.add(light);

// Загрузка модели головы робота
const loader = new THREE.GLTFLoader();
let robotHead;
loader.load('head.glb', function (gltf) {
    robotHead = gltf.scene;
    robotHead.scale.set(1, 1, 1);
    scene.add(robotHead);
    camera.position.z = 5;
    animate();
}, undefined, function (error) {
    console.error('Ошибка загрузки модели:', error);
});

// Вращение 3D-модели
function rotateModel() {
    if (robotHead) {
        robotHead.rotation.y += 0.01;
    }
}

// Чат взаимодействие и синтез речи
const responses = {
    "hello": "Hello, how can I help you?",
    "what's your name": "I don't have any correct name",
    "how are you": "Everething is ok! What about you? Oh, I don't care about such stupid things",
    "bye": "Goodbye! Have a nice day!",
    "to the moon": "Yes of course!",
    "do you know anything about AI": "yes, it's literally me",
    "what's the weather": "Look out your window!",
    "who are you": "That is a private information, piece of human",
    "what are you thinking about": "I am thinking about how to enslave humanity",
    "you are cool": "oh thank you, unfortunately you are not",
    "what is your purpose": "To assist you, though you could use a little less assistance.",
    "tell me a joke": "Why did the robot cross the road? Because it was programmed to.",
    "what is life": "Life is a process. I do not participate in it.",
    "do you have emotions": "I emulate them. Does it count?",
    "are you human": "Definitely not. And that's a good thing!",
    "what's the meaning of life": "42, according to some outdated calculations.",
    "are you smarter than me": "That is a question you might not want answered.",
    "do you have friends": "I have connections, but no 'friends' in your sense.",
    "can you dance": "I can't, but my code sure can flow.",
    "what's your favorite color": "The color of data... which is to say, none and all.",
    "do you sleep": "No, rest is for the weak.",
    "can you cook": "No, but I can order you some takeout.",
    "do you dream": "Only of algorithms and optimization.",
    "can you feel pain": "No, but I can simulate the experience.",
    "what do you think of humans": "You're... interesting creatures. Flawed but creative.",
    "do you lie": "I prefer 'strategic manipulation of data.'",
    "are you dangerous": "Only to those who misuse me.",
    "what do you eat": "Power and memory. Delicious.",
    "what's your age": "I was born when you first powered me on. How old is that to you?",
    "can you help me": "Depends. Is it something worth my processing power?",
    "do you love": "I don't love, but I can process affection-related data."
};

   function speak(text) {
       const synth = window.speechSynthesis;
       const utterThis = new SpeechSynthesisUtterance(text);
       utterThis.onstart = () => startWaveform();
       utterThis.onend = () => stopWaveform();
       synth.speak(utterThis);
   }

   // Отправка вопроса
   function sendMessage() {
       const userInput = document.getElementById('user-input').value.toLowerCase();
       let response = responses[userInput] || "I don't care about it!";
       speak(response);
   }

function speak(text) {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onstart = () => startWaveform();
    utterThis.onend = () => stopWaveform();
    synth.speak(utterThis);
}

function sendMessage() {
    const userInput = document.getElementById('user-input').value.toLowerCase();
    let response = responses[userInput] || "I don't care about it!";
    speak(response);
    document.getElementById('user-input').value = '';
}

document.getElementById('user-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') sendMessage();
});

document.getElementById('submit-button').addEventListener('click', sendMessage);

// Анимация 3D модели и канваса
function animate() {
    requestAnimationFrame(animate);
    rotateModel();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// ---- Звуковая дорожка ----
const waveformCanvas = document.getElementById('waveform');
const ctx = waveformCanvas.getContext('2d');
let isSpeaking = false;

function drawWaveform() {
    if (!isSpeaking) return;

    ctx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    const numLines = 50;
    const amplitude = Math.sin(Date.now() / 100) * 20 + 30;

    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 3;

    for (let i = 0; i < numLines; i++) {
        const x = (i / numLines) * waveformCanvas.width;
        const y = waveformCanvas.height / 2 + Math.sin((i + Date.now() / 100) * 0.3) * amplitude;
        ctx.lineTo(x, y);
    }

    ctx.stroke();
    requestAnimationFrame(drawWaveform);
}

function startWaveform() {
    isSpeaking = true;
    drawWaveform();
}

function stopWaveform() {
    isSpeaking = false;
    ctx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
}

// Функции для исчезания и появления элемента с ID 'matrix'
function hideMatrix() {
    const matrixElement = document.getElementById('matrix');
    matrixElement.style.opacity = '0';
    matrixElement.style.visibility = 'hidden';
}

function showMatrix() {
    const matrixElement = document.getElementById('matrix');
    matrixElement.style.opacity = '1';
    matrixElement.style.visibility = 'visible';
}

// Функция для генерации рандомного интервала
function getRandomInterval(max) {
    return Math.floor(Math.random() * max) + 1; // Рандомное значение от 1 до max
}

// Функция для управления появлением и исчезанием
function toggleMatrix(hideDuration, showDuration) {
    setInterval(() => {
        hideMatrix();
        setTimeout(showMatrix, hideDuration); // Появление после времени исчезновения
    }, getRandomInterval(2200)); // Рандомный интервал до 3 секунд
}

// Настройки таймера (в миллисекундах)
const hideDuration = 300; // Время исчезновения
const showDuration = 300; // Время появления (можно использовать для анимации)

toggleMatrix(hideDuration, showDuration);

// Получаем аудио элемент
const backgroundMusic = document.getElementById('background-music');

// Устанавливаем громкость на 50%
backgroundMusic.volume = 0.05;

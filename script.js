const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = 'join.jpeg';

const signatureCanvas = document.getElementById('signatureCanvas');
const signatureCtx = signatureCanvas.getContext('2d');

let drawing = false;

// 이미지 로드 후 캔버스 설정
img.onload = () => {
    resizeCanvas();
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 원본 이미지 크기로 먼저 그리기
    setupInputFields();
};

window.addEventListener('resize', () => { // 브라우저 창의 크기가 변경될 때마다 크기 조정
    resizeCanvas(); // 캔버스 크기 조정
    setupInputFields(); // 입력 필드 및 서명 박스 위치 재조정
});

function resizeCanvas() {
    const aspectRatio = img.width / img.height; // 이미지의 가로 세로 비율 계산

    // 화면에 맞게 캔버스 크기 조정 (이미지 비율 유지)
    if (window.innerWidth / window.innerHeight > aspectRatio) {
        canvas.width = window.innerHeight * aspectRatio;
        canvas.height = window.innerHeight;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth / aspectRatio;
    }

    // 스크롤을 위한 설정
    canvas.style.overflow = 'auto';

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스를 지운 뒤 이미지를 다시 그리기
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 캔버스에 맞게 이미지 그리기
    setupInputFields(); // 브라우저 창의 크기에 따라 입력 필드 위치 재조정
}

function setupInputFields() { // 입력 필드 위치 재조정
    const nameField = document.getElementById('nameField');
    nameField.style.width = `${canvas.width * 0.15}px`;
    nameField.style.top = `${canvas.height * 0.113}px`;
    nameField.style.left = `${canvas.width * 0.1}px`;
    nameField.style.fontSize = `${canvas.height * 0.015}px`;

    const checkbox = document.getElementById('checkbox1');
    checkbox.style.top = `${canvas.height * 0.32}px`;
    checkbox.style.left = `${canvas.width * 0.06}px`;
    checkbox.style.width = checkbox.style.height = `${canvas.height * 0.02}px`;

    const submitButton = document.getElementById('submitButton');
    submitButton.style.top = `${canvas.height * 0.95}px`;
    submitButton.style.left = `${canvas.width * 0.1}px`;
    submitButton.style.fontSize = `${canvas.height * 0.02}px`;

    const signatureBox = document.getElementById('signatureArea');
    const canvasRect = canvas.getBoundingClientRect();
    signatureBox.style.top = `${canvasRect.bottom - (canvasRect.height * 0.055)}px`;
    signatureBox.style.left = `${canvasRect.left + (canvasRect.width * 0.76)}px`;
    signatureBox.style.width = `${canvasRect.height * 0.15}px`;
    signatureBox.style.height = `${canvasRect.height * 0.048}px`;
}

// 서명 그리기 관련 코드
signatureCanvas.addEventListener('mousedown', startDrawing);
signatureCanvas.addEventListener('mouseup', stopDrawing);
signatureCanvas.addEventListener('mousemove', draw);
signatureCanvas.addEventListener('touchstart', startDrawing);
signatureCanvas.addEventListener('touchend', stopDrawing);
signatureCanvas.addEventListener('touchmove', draw);

function startDrawing(event) {
    drawing = true;
    draw(event);
}

function stopDrawing() {
    drawing = false;
    signatureCtx.beginPath();
}

function draw(event) {
    if (!drawing) return;

    const rect = signatureCanvas.getBoundingClientRect();
    const x = (event.clientX || event.touches[0].clientX) - rect.left;
    const y = (event.clientY || event.touches[0].clientY) - rect.top;

    signatureCtx.lineWidth = 4; // 선 굵기 증가
    signatureCtx.lineCap = 'round';
    signatureCtx.strokeStyle = 'blue'; // 서명 색상

    signatureCtx.lineTo(x, y);
    signatureCtx.stroke();
    signatureCtx.beginPath();
    signatureCtx.moveTo(x, y);
}

// 제출 버튼 클릭 시 동작
document.getElementById('submitButton').addEventListener('click', () => {
    const name = document.getElementById('nameField').value;

    // 캔버스에 텍스트 추가
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스를 지운 뒤 이미지를 다시 그리기
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 이미지 다시 그리기
    ctx.font = `${canvas.height * 0.02}px Arial`;
    ctx.fillStyle = 'blue'; // 텍스트 색상

    // 입력 필드의 위치를 기준으로 텍스트 위치 설정
    const nameFieldRect = document.getElementById('nameField').getBoundingClientRect();
    const nameX = nameFieldRect.left - canvas.getBoundingClientRect().left; // 캔버스 내 위치 계산
    const nameY = nameFieldRect.top - canvas.getBoundingClientRect().top + (nameFieldRect.height * 0.8); // 텍스트 높이 조정

    ctx.fillText(name, nameX, nameY); // 입력 필드 위치에 텍스트 추가

    // 서명 추가
    const signatureData = signatureCanvas.toDataURL();
    const signatureImg = new Image();
    signatureImg.src = signatureData;
    signatureImg.onload = () => {
        const signatureFieldRect = signatureCanvas.getBoundingClientRect();
        const signatureX = signatureFieldRect.left - canvas.getBoundingClientRect().left; // 서명 위치 조정
        const signatureY = signatureFieldRect.top - canvas.getBoundingClientRect().top; // 서명 위치 조정
        ctx.drawImage(signatureImg, signatureX, signatureY); // 서명 위치 조정

        // 다운로드 팝업 (화질 손실 없이 PNG로 다운로드)
        const link = document.createElement('a');
        link.download = '최고화질_텍스트필드1.png';
        link.href = canvas.toDataURL('image/png'); // PNG 형식으로 다운로드
        link.click();
    };
});

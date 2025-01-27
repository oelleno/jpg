const nameField = document.getElementById('nameField');
nameField.addEventListener('blur', () => {
  const value = nameField.value;
  if (value.length < 2 || value.length > 5) {
    alert('이름은 한글 2~5자만 입력 가능합니다.');
  }
});

const phoneField = document.getElementById('phoneField');
phoneField.addEventListener('blur', () => {
  const value = phoneField.value.replace(/[^0-9]/g, '');
  if (value.length !== 11) {
    alert('전화번호는 11자리 숫자를 입력해야 합니다.');
    phoneField.value = '';
  } else {
    phoneField.value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
  }
});

phoneField.addEventListener('input', () => {
  const value = phoneField.value.replace(/[^0-9]/g, '');
  phoneField.value = value.slice(0, 11);
});

// 가입비와 기간회비 자동 변환
const registrationFeeInput = document.getElementById('registrationFeeInput');
const membershipFeeInput = document.getElementById('membershipFeeInput');

[registrationFeeInput, membershipFeeInput].forEach(input => {
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value) {
      e.target.value = '₩' + parseInt(value).toLocaleString('ko-KR');
    } else {
      e.target.value = '';
    }
  });

  input.addEventListener('focus', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = value;
  });

  input.addEventListener('blur', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      e.target.value = '₩' + parseInt(value).toLocaleString('ko-KR');
    }
  });
});

// 총합계 자동 변환
const totalAmountInput = document.getElementById('totalAmountInput');

totalAmountInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/[^\d]/g, '');
  if (value) {
    e.target.value = '₩' + parseInt(value).toLocaleString('ko-KR');
  } else {
    e.target.value = '';
  }
});

totalAmountInput.addEventListener('focus', (e) => {
  let value = e.target.value.replace(/[^0-9]/g, '');
  e.target.value = value;
});

totalAmountInput.addEventListener('blur', (e) => {
  let value = e.target.value.replace(/[^0-9]/g, '');
  if (value) {
    e.target.value = '₩' + parseInt(value).toLocaleString('ko-KR');
  }
});

// 생년월일 포맷팅
const birthField = document.querySelector('input[placeholder="생년월일 입력"]');
birthField.addEventListener('blur', () => {
  let value = birthField.value.replace(/[^0-9]/g, '');
  if (value.length === 6) {
    value = '19' + value;
  }
  if (value.length === 8) {
    birthField.value = value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  }
});

document.getElementById('submitBtn').addEventListener('click', () => {
  html2canvas(document.getElementById('container')).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/jpeg');
    link.download = 'contract.jpg';
    link.click();
  }).catch(error => {
    console.error('캔버스 생성 중 오류 발생:', error);
  });
});

// Signature Functionality
const canvas = document.getElementById('signatureCanvas');
const modalCanvas = document.getElementById('modalSignatureCanvas');
const modal = document.getElementById('signatureModal');
const ctx = canvas.getContext('2d');
const modalCtx = modalCanvas.getContext('2d');
let drawing = false;

// Open modal when clicking the small canvas
canvas.addEventListener('click', () => {
  modal.style.display = 'block';
  // Copy content to modal canvas
  modalCtx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
  modalCtx.drawImage(canvas, 0, 0, modalCanvas.width, modalCanvas.height);
});

// Drawing on modal canvas
modalCanvas.addEventListener('mousedown', (e) => {
  drawing = true;
  const rect = modalCanvas.getBoundingClientRect();
  modalCtx.beginPath();
  modalCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
});

modalCanvas.addEventListener('mousemove', (e) => {
  if (drawing) {
    const rect = modalCanvas.getBoundingClientRect();
    modalCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    modalCtx.stroke();
  }
});

modalCanvas.addEventListener('mouseup', () => {
  drawing = false;
});

modalCanvas.addEventListener('mouseout', () => {
  drawing = false;
});

// Confirm signature
document.getElementById('confirmSignature').addEventListener('click', () => {
  modal.style.display = 'none';
  // Copy content to small canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(modalCanvas, 0, 0, canvas.width, canvas.height);
});

document.getElementById('clearSignature').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  modalCtx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
});

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

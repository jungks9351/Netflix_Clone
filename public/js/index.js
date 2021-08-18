//DOM

const $loginForm = document.querySelector('#loginForm');
const $userId = document.querySelector('#userId');
const $password = document.querySelector('#password');
const $inputs = document.querySelectorAll('form > input');

// 서버에 POST 하기

// 언제

$loginForm.onsubmit = async (e) => { 
  //form 기본 동작 이벤트 방지
  e.preventDefault();
  // payload 설정
  const payload = {
    userId: $userId.value,
    $password: $password.value,
  };
  // promise 정의
  const promise = await fetch('http://localhost:7000/api/user/login',
  {
    method: 'POST',
    headers: { 'content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  // console.log(promise);
  // promise를 계속 받아쓸려면 await 정의하기
  const res =  await promise.json();
  // console.log(res);

  // promise.status 변화에 의한 정의
  if (promise.status === 401) {
    
    $inputs.forEach((input) => {
      // console.log(typeof res.message);
      const $div = document.createElement('div');
      $div.classList.add('error-message');
      $div.append(`${res.message}`);
      
      if (input.id === res.position) {
        
        input.after($div);

      }
    })
  }
}
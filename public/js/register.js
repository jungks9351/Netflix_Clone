//DOM
const $registerForm = document.querySelector('#registerForm');
const $userId = document.querySelector('#userId');
const $password = document.querySelector('#password');
const $passwordConfirm = document.querySelector('#passwordConfirm');
const $nickName = document.querySelector('#nickName');
const $inputs = document.querySelectorAll('form > input');
const $registBtn =document.querySelector('#registBtn');
// server에 POST 하기

//언제
$registerForm.onsubmit = async (e) => {
  // Form 기본 동작 이벤트 방지
  e.preventDefault();
  // POST할 payload
  const payload = {
    userId: $userId.value,
    password: $password.value,
    passwordConfirm: $passwordConfirm.value,
    nickname: $nickName.value
  }
  console.log(payload);
  // 회원가입 양식을 server에 POST
  const promise = await fetch('http://localhost:7000/api/user/register', {
    method: 'POST',
    headers: { 'content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });

  const res = await promise.json();
  // console.log(res);

  if (promise.status === 400 || promise.status ===409) {
    // console.log($inputs);
    $inputs.forEach((input) => {
      // input.removeChild
      
      const errorMessage = input.nextElementSibling.classList.contains('error-message');
      if (errorMessage) {
        input.nextElementSibling.remove();
      }
      if (input.id === res.position) {
        // const $p = document.createElement('p');
        // const $div = document.createElement('div');
        // // input.setAttribute('placeholder', `${res.message}`)
        // $div.classList.add('error-message');
        // $p.textContent= `${res.message}`;
        // $div.appendChild($p);

        input.insertAdjacentHTML('afterend', `<p class="error-message">${res.message}</p>`);
        input.value = "";
        input.focus();
      }
    })
  }
  if (promise.status === 200) {
    window.location.href = "../index.html";
  }
}
//DOM
const $sections = document.querySelectorAll("#section");
const $prevBtn = document.querySelectorAll("#prevBtn");
const $nextBtn = document.querySelectorAll("#nextBtn");
const $list = document.querySelectorAll(".list");
const $logoutBtn = document.querySelector('#logoutBtn');



//logout 

const token = localStorage.getItem('token');

$logoutBtn.onclick =  () => {
  localStorage.removeItem('token');
  window.location.href = '../index.html'
}

// 변수 생성
// slider 변수
const moveDistance = 1340;
let locationFlag = 1;

// movielist 생성 변수 
let movieGenres = [];
const posterFileUrl = 'https://image.tmdb.org/t/p/w500/';

// bookmark 변수
let bookmarkMovies = [];

//slider

// console.log(locationFlag);
//nextBtn 클릭시 함수 설정
const nextMove = _.throttle((e) => {
  locationFlag++; // 실행순서 1

  // console.log(locationFlag);

  const genreList = e.target.parentNode.firstElementChild;

  // 실행순서 2
  if (locationFlag === 5) {
    // 실행순서 4
    setTimeout(() => {
      genreList.style.transition = 'none';
      genreList.style.transform = 'translateX(-1340px)';
      locationFlag = 1;
    }, 1000)
  }
  
  // 실행순서 3
  genreList.style.transform = `translateX(-${moveDistance*(locationFlag-1)}px)`; 
  genreList.style.transition = "all 1s";
  
}, 1200);

//prevBtn 클릭시 함수 설정
const prevMove = _.throttle((e) => {
  locationFlag--;

  const genreList = e.target.parentNode.firstElementChild;
  
  // console.log(locationFlag);
  //2
  if (locationFlag === 0) {
    setTimeout(() => {
      genreList.style.transition = "none";
      genreList.style.transform = `translateX(-5360px)`
      locationFlag = 4;
      
    }, 1000)
  }
  
  // 3
  genreList.style.transition = "all 1s";
  genreList.style.transform = `translateX(-${moveDistance*(locationFlag)}px)`;
  
}, 1200);

// list class를 가지는 ul요소 순환해서 버튼 이벤트 설정

$list.forEach((list, i) => {
  
  $nextBtn[i].onclick= (e) => {

    nextMove(e);
  }
  
  $prevBtn[i].onclick = (e) => {
    prevMove(e);
  }
});


// list 생성

const getMovies = async (genreName, $ul, index) => {
  // api 정보 GET
  
  const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=b1f42a273f605f2b79d537a4c1929770&language=ko-KR');
  
  // res 의 장르를 객체 디스트럭처링 직렬화
  
  const {genres} = await res.json();
  
  movieGenres = genres;
  
  // console.log(movieGenres);
  
  const genreId = {
    actionList: 28,
    comedyList: 35,
    animationList: 16,
    fatasyList: 14
  };
  
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=b1f42a273f605f2b79d537a4c1929770&language=ko-KR&sort_by=popularity.desc&with_genres=${genreId[genreName]}`
  
  
  const genreData = await fetch(url);
  
  const genreRes =  await genreData.json();
  
  const {results:movies} = genreRes;
  
  // console.log($ul);
  // poster 가져오는 함수 설정
  movies.forEach((movie)=> {

    const $li = document.createElement('li');
    const $img = document.createElement('img');
    const $div = document.createElement('div');
    const $btn = document.createElement('button');
    $li.classList.add('movie-item');
    $div.classList.add('bookmark');
    $btn.classList.add('bookmark-btn', 'far', 'fa-heart');
    $btn.setAttribute('id', `${movie.id}`);
    $div.appendChild($btn);


    $img.setAttribute('src', `${posterFileUrl}${movie.backdrop_path}`);
    $li.appendChild($img);
    $li.appendChild($div);
    $ul.appendChild($li);
    
  });
  
  cloneList($ul);
  if (index === 3) {
    
    const $bookmarkBtn = document.querySelectorAll('.bookmark > button');
    bookmarkMovies = $bookmarkBtn;
    addBookmark(bookmarkMovies);
  }

  // console.log($ul.querySelectorAll('li'));
}

// cloneList 함수 정의

const cloneList = ($ul) => {

  const $sliderList = $ul.querySelectorAll('li');
  const sliderLengthCount = $sliderList.length-1;
  for (let i =0; i< 5 ; i++) {
  
    const firstCopyList = $sliderList[i].cloneNode(true); // 앞 list 1개 복사
    $ul.appendChild(firstCopyList);
    // console.log(`${lastCopyList}`);
  
    const lastCopyList = $sliderList[sliderLengthCount-i].cloneNode(true);
    // console.log(`${lastCopyList}`);
  
    $ul.insertBefore(lastCopyList, $ul.firstElementChild);
  
  }
  // console.log($ul.querySelectorAll('li'));
}

// section genre 탐색 함수 설정

[...$sections].forEach((section, i) => {

  const genre = section.firstElementChild.id;
  
  getMovies(genre, $list[i], i);
})

//bookmark 추가 생성 함수 정의
const addBookmark = (bookmarks) => {
  // console.log(bookmarks);
  // boomarks : bookmarkBtn NodeList 배열이다.
  bookmarks.forEach((bookmark) => {
    // bookmark : bookmarkBtn 의 DOM이다.
    // console.log(bookmark);
    // bookmark 추가 함수 정의
    bookmark.onclick = async ({target}) => {
      const bookmarkId = target.id;
      const poster = target.parentNode.previousElementSibling.src;
      const payload = {
        poster: `${poster}`,
        token: localStorage.getItem('token')
      };
      const res = await fetch(`http://localhost:7000/api/bookmark?id=${bookmarkId}`,
      {
        method: 'POST',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      // res.json();
    }
  })
}

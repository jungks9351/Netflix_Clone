//DOM
const $sections = document.querySelectorAll("#section");
const $prevBtn = document.querySelectorAll("#prevBtn");
const $nextBtn = document.querySelectorAll("#nextBtn");
const $list = document.querySelectorAll(".list");


// 변수 생성

const moveDistance = 1340;
let locationFlag = 2;

let movieGenres = [];

const posterFileUrl = 'https://image.tmdb.org/t/p/w500/';

//slider

//nextBtn
const nextMove = _.throttle((e) => {
  locationFlag++; // 실행순서 1

  const genreList = e.target.parentNode.firstElementChild;

  // 실행순서 2
  if (locationFlag === 4) {
    // 실행순서 4
    setTimeout(() => {
      genreList.style.transition = 'none';
      genreList.style.transform = 'translateX(-1340px)';
      locationFlag = 1;
      locationFlag++;
    }, 1000)
  }
  
  // 실행순서 3
  genreList.style.transform = `translateX(-${moveDistance*(locationFlag-1)}px)`; 
  genreList.style.transition = "all 1s";
  
}, 1200);

//prevBtn

//클릭시 호출 함수 생성
const prevMove = _.throttle((e) => {
  locationFlag--;

  const genreList = e.target.parentNode.firstElementChild;
  
  //2
  if (locationFlag === 1) {
    setTimeout(() => {
      genreList.style.transition = "none";
      genreList.style.transform = `translateX(-2680px)`
      locationFlag = 3;
      
    }, 1000)
  }
  
  // 3
  genreList.style.transition = "all 1s";
  genreList.style.transform = `translateX(-${moveDistance*(locationFlag-1)}px)`;
  
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


const getMovies = async (genreName, $ul) => {
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
  
  
  // poster 가져오는 함수 설정
  console.log(movies);
  movies.forEach((movie)=> {
    // console.log(movie);
    const $li = document.createElement('li');
    const $img = document.createElement('img');
    const $p = document.createElement('p');
    $p.append(`${movie.title}`);
    $img.setAttribute('src', `${posterFileUrl}${movie.poster_path}`);
    $li.appendChild($img);
    $li.appendChild($p);
    $ul.appendChild($li);

    
  })
}
//list 생성 함수
// const createList = (movielist) => {
//   console.log(movielist);
//   const $li = document.createElement('li');
//   const $img = document.createElement('img');
//   $li.appendChild($img)

//   movielist.appendChild($li);
// }

// $list.forEach((movielist, i) => {

//   createList(movielist);
// });

// section genre 탐색 함수 설정

[...$sections].forEach((section, i) => {

  const genre = section.firstElementChild.id;
  
  getMovies(genre, $list[i]);
})

//DOM
const $sections = document.querySelectorAll("#section");
const $prevBtn = document.querySelector("#prevBtn");
const $nextBtn = document.querySelector("#nextBtn");

// 변수

const moveDistance = 1340;
let locationFlag = 2;

let movieGenres = [];


//slider

//nextBtn

const nextMove = _.throttle(() => {
  locationFlag++; // 실행순서 1

  // 실행순서 2
  if (locationFlag === 4) {
    // 실행순서 4
    setTimeout(() => {
      $list.style.transition = 'none';
      $list.style.transform = 'translateX(-1340px)';
      locationFlag = 1;
      locationFlag++;
    }, 1000)
  }

  // 실행순서 3
  $list.style.transform = `translateX(-${moveDistance*(locationFlag-1)}px)`; 
  $list.style.transition = "all 1s";

}, 1200);

// prevBtn

//클릭시 호출 함수 생성
const prevMove = _.throttle(() => {
  locationFlag--;

  //2
  if (locationFlag === 1) {
    setTimeout(() => {
      
      $list.style.transition = "none";
      $list.style.transform = `translateX(-2680px)`
      locationFlag = 3;

    }, 1000)
  }

  // 3
  $list.style.transition = "all 1s";
  $list.style.transform = `translateX(-${moveDistance*(locationFlag-1)}px)`;


}, 1200);


$nextBtn.onclick= () => {
  nextMove();
}

$prevBtn.onclick = () => {
  prevMove();
}




// list 생성



const createList = () => {

  const $li = document.createElement('li');
  const $img = document.createElement('img');

  $list.appendChild($li);

}

const getMovies = async (genreName) => {
  const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=b1f42a273f605f2b79d537a4c1929770&language=ko-KR');
  
  const {genres} = await res.json();

  movieGenres = genres;

  const genreId = {
    actionList: 28,
    comedyList: 35
  };

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=b1f42a273f605f2b79d537a4c1929770&language=ko-KR&sort_by=popularity.desc&with_genres=${genreId[genreName]}`
  
  const resData = await fetch(url);
  const movieRes =  await resData.json();

  const {results:movies} = movieRes;

  console.log(movies);

}

[...$sections].forEach((section) => {
  const genre = section.firstElementChild.id;
  
  getMovies(genre);
  console.log(genre);
})
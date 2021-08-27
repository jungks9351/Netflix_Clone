//DOM

const $logoutBtn = document.querySelector('#logoutBtn');
const $bookmarkList = document.querySelector('#bookmarkList');

//logout

const token = localStorage.getItem('token');

$logoutBtn.onclick = () => {
  localStorage.removeItem('token');
  window.location.href = '../index.html';
};

// bookmark GET

const getBookmarks = async () => {
  
  const token = localStorage.getItem('token')
  const res =  await fetch('http://localhost:7000/api/bookmark/list', {
    method: 'GET',
    headers: { 'Authorization': `${token}` }
  })
  const bookmarks = await res.json();

  bookmarks.forEach((bookmark) => {
    const poster = bookmark.poster;
    const movieId = bookmark.movieId;
    const $li = document.createElement('li');
    const $img = document.createElement('img');
    const $div = document.createElement('div');
    const $btn = document.createElement('button');
    $div.classList.add('bookmark');
    $btn.classList.add('bookmark-btn', 'fas', 'fa-heart', 'bookmarked');
    $btn.setAttribute('id', `${movieId}`);
    $img.setAttribute('src', `${poster}`);
    $li.classList.add('bookmark-item');
    $div.appendChild($btn);
    $li.appendChild($img);
    $li.appendChild($div);
    $bookmarkList.appendChild($li);
    
  });
  const $bookmarkBtns = document.querySelectorAll('.bookmark-btn');
  // console.log($bookmarkBtns);
  deleteBookmark($bookmarkBtns);
};
getBookmarks();

const deleteBookmark = (bookmarkBtns) => {
  bookmarkBtns.forEach((bookmarkBtn) => {
    bookmarkBtn.onclick=  async ({target}) => {
      if (!target.classList.contains('bookmarked')) return;
      const bookmarkId = target.id;
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:7000/api/bookmark?id=${bookmarkId}`, 
      {
        method: 'DELETE',
        headers: {'Authorization': `${token}`}
      });
      if (res.status === 200) {
        bookmarkBtn.classList.toggle('bookmarked');
      }
    }
  })
}
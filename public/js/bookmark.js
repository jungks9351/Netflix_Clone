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
    const $li = document.createElement('li');
    const $img = document.createElement('img');
    $img.setAttribute('src', `${poster}`);
    $li.classList.add('bookmark-item');
    $li.appendChild($img);
    $bookmarkList.appendChild($li);
  })
};
getBookmarks();

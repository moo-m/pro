import '../css/style.css'
const APIURL:string =
"https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=";
const IMGPATH:string = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI: string =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
let arr: any = [];
const main = document.querySelector<HTMLDivElement>(".main")!;
const form = document.querySelector<HTMLFormElement>(".form")!;
const pagen = document.querySelector<HTMLFormElement>(".page-num")!;
const scrollUpButton = document.getElementById('scrollUpButton')! as HTMLDivElement;
const search = document.querySelector<HTMLInputElement>(".search")!;
const scrolling = document.querySelector('.scrolling')! as HTMLDivElement;

let pageNum:number = 0, isLoading:boolean = false,searches:boolean = false;


interface Obj {
  title: string; poster_path: string; vote_average: string; overview: string;
}
async function getMovies(url: string,search?:boolean): Promise<any> {
  const resp = await fetch(search ? url : url + '1');
  const respData = await resp.json();
  pageNum +=respData.results.length
  search ? arr.length = 0 : arr
  search?pageNum = respData.results.length: pageNum
  pagen.textContent = `load:${pageNum}`;

  showMovies( respData.results);
}
getMovies(APIURL)
function showMovies(movies:Obj[]) {
  // clear main
  movies = arr = [...arr, ...movies]

  main.innerHTML = "";
  movies.forEach(function mg(movie: {
    title: string; poster_path: string; vote_average: string; overview: string;
  }):void {
    const { title, poster_path, vote_average, overview
    } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
<div class="image-container">
  <div class="vote">${parseFloat(vote_average).toFixed(1)}</div>
<img
src="${IMGPATH + poster_path}"
alt="${title}"
class="img">
<div class="overview">${overview}</div>
</div>

        `;

    main.appendChild(movieEl);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm:string = search.value;
console.log(searchTerm)
  if (searchTerm) {
    getMovies(SEARCHAPI + searchTerm,true);
    searches=true
    search.value = "";
    pagen.textContent = `load:${pageNum}`;

  }
});
async function getMore(arg: string): Promise<any>  {
  const resp = await fetch(`${arg+pageNum}`);
  const respData = await resp.json();
  showMovies(respData.results);
  pageNum += respData.results.length
  pagen.textContent = `load:${pageNum}`;
  return
}

addEventListener('scroll', () => {
  scrolling.style.width = `${(document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100}%`;
  scrollY > innerHeight * 2 ? scrollUpButton.style.visibility = 'visible' : scrollUpButton.style.visibility = 'hidden'
  if (!isLoading && !searches && main.scrollHeight - innerHeight <= scrollY + 50) {
    isLoading = true;
    getMore(APIURL).then(() => {
      isLoading = false;
    });
  }
});

scrollUpButton.addEventListener('click', () => {
  scrollTo({ top: 0, behavior: 'smooth' });
});

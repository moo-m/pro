"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../css/style.css");
const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
let arr = [];
const main = document.querySelector(".main");
const form = document.querySelector(".form");
const pagen = document.querySelector(".page-num");
const scrollUpButton = document.getElementById('scrollUpButton');
const search = document.querySelector(".search");
const scrolling = document.querySelector('.scrolling');
let pageNum = 0, isLoading = false, searches = false;
function getMovies(url, search) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield fetch(search ? url : url + '1');
        const respData = yield resp.json();
        pageNum += respData.results.length;
        search ? arr.length = 0 : arr;
        search ? pageNum = respData.results.length : pageNum;
        pagen.textContent = `load:${pageNum}`;
        showMovies(respData.results);
    });
}
getMovies(APIURL);
function showMovies(movies) {
    // clear main
    movies = arr = [...arr, ...movies];
    main.innerHTML = "";
    movies.forEach(function mg(movie) {
        const { title, poster_path, vote_average, overview } = movie;
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
    const searchTerm = search.value;
    console.log(searchTerm);
    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm, true);
        searches = true;
        search.value = "";
        pagen.textContent = `load:${pageNum}`;
    }
});
function getMore(arg) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield fetch(`${arg + pageNum}`);
        const respData = yield resp.json();
        showMovies(respData.results);
        pageNum += respData.results.length;
        pagen.textContent = `load:${pageNum}`;
        return;
    });
}
addEventListener('scroll', () => {
    scrolling.style.width = `${(document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100}%`;
    scrollY > innerHeight * 2 ? scrollUpButton.style.visibility = 'visible' : scrollUpButton.style.visibility = 'hidden';
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

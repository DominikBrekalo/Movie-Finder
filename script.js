const form = document.querySelector('form');
const gallery = document.querySelector('.image-container');
const loadMoreBtn = document.createElement('button');
loadMoreBtn.textContent = "Load More";
loadMoreBtn.classList.add('load-more-btn');
loadMoreBtn.addEventListener('click', loadMoreMovies);
document.body.appendChild(loadMoreBtn);

let moviesLoaded = 0;
let queryIndex = 0;
const queryLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

document.addEventListener("DOMContentLoaded", () => {
    preloadMovies();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let query = form.querySelector('input').value.trim();
    form.querySelector('input').value = '';
    
    if (query === '') return;
    
    gallery.innerHTML = '';
    moviesLoaded = 0; 
    queryIndex = 0;
    await fetchMovies(query);
});

async function preloadMovies() {
    for (let i = 0; i < 10; i++) {
        await fetchMovies(getQueryLetter());
    }

    loadMoreBtn.style.display = "block";
}

async function loadMoreMovies() {
    for (let i = 0; i < 10; i++) {
        await fetchMovies(getQueryLetter());
    }

    moviesLoaded += 80;

    if (moviesLoaded >= 160) {
        loadMoreBtn.style.display = "none"; 
    }
}

async function fetchMovies(query) {
    try {
        const res = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const shows = await res.json();
        displayMovies(shows);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayMovies(shows) {
    if (shows.length === 0 && gallery.innerHTML === '') {
        gallery.innerHTML = '<p class="no-results">No results found</p>';
        return;
    }

    shows.forEach(show => {
        if (show.show.image) {
            const div = document.createElement('div');
            div.classList.add('movie-card');

            const img = document.createElement('img');
            img.src = show.show.image.medium;
            img.alt = show.show.name;
            img.loading = "lazy";
            img.classList.add('movie-image');

            const title = document.createElement('p');
            title.textContent = show.show.name;
            title.classList.add('movie-title');

            div.appendChild(img);
            div.appendChild(title);
            gallery.appendChild(div);
        }
    });
}

function getQueryLetter() {
    const letter = queryLetters[queryIndex % queryLetters.length];
    queryIndex++;
    return letter;
}
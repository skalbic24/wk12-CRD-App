/* 
Create a CRD application (CRUD without update) using json-server or another API
Use fetch and async/await to interact with the API
Use a form to create/post new entities
Build a way for users to delete entities
Include a way to get entities from the API and display them
You do NOT need update, but you can add it if you'd like
Use Bootstrap and/or CSS to style your project
*/

let url = `http://localhost:3000/`;

class MovieReviews {
    constructor() {
        this.searchResults = [];
        this.searchTerm = '';
        this.lastAddedMovie = null; // Keep track of the last added movie
    }

    async initApp() {
        let searchBar = document.getElementById('searchBar');
        let searchButton = document.getElementById('searchButton');
        let updateLastAddedButton = document.getElementById('updateLastAdded');
        let deleteLastAddedButton = document.getElementById('deleteLastAdded');

        // Event listener for updating the last added movie
        updateLastAddedButton.addEventListener('click', () => {
            if (this.lastAddedMovie) {
                let updatedMovie = {
                    Title: 'Updated Movie',
                    Year: '2025',
                    Poster: 'https://via.placeholder.com/150'
                };
                this.updateMovie(this.lastAddedMovie.id, updatedMovie);
            } else {
                console.log('No movie has been added yet.');
            }
        });

        // Event listener for deleting the last added movie
        deleteLastAddedButton.addEventListener('click', () => {
            if (this.lastAddedMovie) {
                this.deleteMovie(this.lastAddedMovie.id);
            } else {
                console.log('No movie has been added yet to delete.');
            }
        });

        searchButton.addEventListener('click', async () => {
            this.searchTerm = searchBar.value.trim(); // Capture input from search bar
            if (this.searchTerm) {
                let newMovie = {
                    Title: this.searchTerm, // Use search term as movie title
                    Year: '2024', // Example year
                    Poster: 'https://via.placeholder.com/300' // Placeholder poster
                };
                await this.postMovie(newMovie);
                searchBar.value = ''; // Clear the input field after adding
            } else {
                console.log('Please enter a movie title.');
            }
        });

        console.log("init app ran");
        await this.fetchMovies(); // Initial fetch of movies
    }

    async fetchMovies() {
        try {
            console.log("Fetching movies");
            let res = await fetch(url + "movies");
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            let data = await res.json();
            console.log("Movies fetched:", data);
            this.drawPosters(data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    }

    async postMovie(movie) {
        try {
            let response = await fetch(url + "movies", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movie)
            });

            if (response.ok) {
                let data = await response.json();
                console.log("New movie added:", data);
                this.lastAddedMovie = data; // Store the last added movie
                this.fetchMovies(); // Refresh the movie list
                return data;
            } else {
                console.error('Error adding movie:', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async updateMovie(id, updatedMovie) {
        try {
            let response = await fetch(`${url}movies/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMovie)
            });

            if (response.ok) {
                let data = await response.json();
                console.log("Movie updated:", data);
            } else {
                console.error('Error updating movie:', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async deleteMovie(id) {
        try {
            let response = await fetch(`${url}movies/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log(`Movie with ID ${id} deleted successfully.`);
                this.lastAddedMovie = null; // Clear the last added movie
                this.fetchMovies(); // Refresh the movie list
            } else {
                console.error('Error deleting movie:', await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async drawPosters(data) {
        console.log("Drawing Posters: ", data);
        let table = document.getElementById('results');
        table.innerHTML = ''; // Clear previous results

        for (let movie of data) {
            let card = document.createElement('div');
            let poster = document.createElement('img');
            let info = document.createElement('h5');

            card.setAttribute('class', 'card');
            poster.setAttribute('class', 'poster');
            poster.src = movie.Poster;
            info.innerText = `${movie.Title} (${movie.Year})`;

            card.appendChild(poster);
            card.appendChild(info);
            table.appendChild(card);
        }

        // Update last added movie if needed
        if (data.length > 0) {
            this.lastAddedMovie = data[data.length - 1]; // Track the last movie in the displayed data
        }
    }
}

const app = new MovieReviews();
app.initApp();
window.onload = () => {
    var apiKey = '9a9fd1d2';
    var currentPage = 1;
    var currentType = 'movie';
    var isLoading = false;
    var peliculas = [];
    var detalles = [];
    var currentInputValue = '';

    var input_busqueda = document.getElementById('input-busqueda');
    const contenedorPeliculas = document.getElementById('peliculas-container');
    var img_home = document.createElement('img');
    img_home.src = './img/foto-home.webp';
    img_home.style.marginTop = '10px'
    img_home.style.width = '100%'
    img_home.style.height = '39.9rem'

    contenedorPeliculas.append(img_home);

    const detallesDiv = document.getElementById('detalles-mensaje');
    const botones = document.querySelectorAll('.boton');

    input_busqueda.addEventListener('input', function () {
        const inputValue = input_busqueda.value;

        if (inputValue !== currentInputValue) {
            currentInputValue = inputValue;
            currentPage = 1;
            loadPeliculas();
        }
    });



    window.addEventListener('scroll', function () {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !isLoading) {
            isLoading = true;
            currentPage++;
            loadPeliculas();
        }
    });

    botones.forEach(button => {
        button.addEventListener('click', function (e) {
            currentType = (e.target.id == 'series') ? 'series' : 'movie';
            currentPage = 1;
            loadPeliculas();
        });
    });

    function loadPeliculas() {
        document.getElementById('cargando').style.display = 'block';
        const link = `https://www.omdbapi.com/?apikey=${apiKey}&s=${currentInputValue}&page=${currentPage}&type=${currentType}`;
        var xhttp = new XMLHttpRequest();
        
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById('cargando').style.display = 'none';
                const datos = JSON.parse(this.responseText);

                if (currentPage === 1) {
                    contenedorPeliculas.innerHTML = '';
                }

                var grupoDiv = document.createElement('div');
                grupoDiv.className = 'grupo-peliculas';

                for (var i = 0; i < datos.Search.length; i++) {
                    var peliculaDiv = document.createElement('div');
                    peliculaDiv.className = 'pelicula';

                    var img = document.createElement('img');

                    if (datos.Search[i].Poster !== 'N/A') {
                        img.src = datos.Search[i].Poster;
                    } else {
                        img.src = './img/Imagen_no_disponible.svg.png';
                    }

                    img.style.width = '205px';
                    img.style.height = '275px';
                    img.style.padding = '30px';
                    img.style.objectFit = 'cover';
                    img.style.margin = '0 auto';

                    var detallesButton = document.createElement('button');

                    detallesButton.innerText = 'Detalles';
                    detallesButton.style.color = 'blue';
                    detallesButton.pelicula = datos.Search[i];

                    detallesButton.id = datos.Search[i].imdbID;

                    detallesButton.addEventListener('click', function (e) {
                        contenedorPeliculas.style.display = 'none';
                        mostrarDetalles(e.target.pelicula);
                        peticionPorID(e.target.id);
                    });
                    
                    peliculaDiv.appendChild(img);
                    peliculaDiv.style.border = '1px solid white';
                    peliculaDiv.style.margin = '5px'
                    peliculaDiv.className = 'peliculas';
                    peliculaDiv.id = datos.Search[i].imdbID;
                    peliculaDiv.appendChild(detallesButton);

                    grupoDiv.appendChild(peliculaDiv);

                    if ((i + 1) % 5 === 0 || i === datos.Search.length - 1) {
                        contenedorPeliculas.appendChild(grupoDiv);
                        grupoDiv = document.createElement('div');
                        grupoDiv.className = 'grupo-peliculas';
                    }
                }

                detalles.length = 0;
                peliculas.length = 0;
                for (div of document.getElementsByClassName('peliculas')) {
                    peliculas.push(div.id);
                }
                isLoading = false;
            }
        };

        xhttp.open("GET", link, true);
        xhttp.send();
    }

    function mostrarDetalles(pelicula) {
        detallesDiv.innerHTML = '';
        var img_detalles = document.createElement('img');
        img_detalles.src = pelicula.Poster;
        img_detalles.style.width = '40%'
        img_detalles.style.height = '40%'
        var p1 = document.createElement('p');
        var p2 = document.createElement('p');
        p1.innerHTML = 'Titulo: ' + pelicula.Title;
        p2.innerHTML = 'Año de lanzamiento: ' + pelicula.Year;
        detallesDiv.append(img_detalles)
        detallesDiv.append(p1);
        detallesDiv.append(p2);
        detallesDiv.style.display = 'block';
        detallesDiv.style.backgroundColor = 'white';
        detallesDiv.style.width = '500px';
        detallesDiv.style.height = '500px';
        detallesDiv.style.marginLeft = '500px';
        detallesDiv.style.marginTop = '70px';
        detallesDiv.style.background = 'grey'
        detallesDiv.style.padding = '20px';
        detallesDiv.style.borderRadius = '10px';
        p1.style.color = 'white';
        p2.style.color = 'white';
        
    }

    function peticionPorID(idPelicula) {
        linkID = `https://www.omdbapi.com/?i=${idPelicula}&apikey=9a9fd1d2`;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var datos = JSON.parse(this.responseText);
                var p2 = document.createElement('p');
                var p3 = document.createElement('p');
                var p4 = document.createElement('p');

                p2.style.color = 'white';
                p3.style.color = 'white';
                p4.style.color = 'white';




                p2.innerHTML = 'Rating :' + datos.imdbRating;
                p3.innerHTML = 'Sinopsis :' + datos.Plot;
                p4.innerHTML = 'Actors :' + datos.Actors;
                detallesDiv.append(p2);
                detallesDiv.append(p3);
                detallesDiv.append(p4);

                let cerrar = document.createElement('img');
                cerrar.style.marginTop = '-430px'
                cerrar.src = './img/cerrar.png';
                detallesDiv.appendChild(cerrar);
                cerrar.id = 'cerrar'
                cerrar.addEventListener('click', () => {
                    detallesDiv.style.display = 'none';
                    contenedorPeliculas.style.display = 'initial';
                })
            }
        };
        xhttp.open("GET", linkID, true);
        xhttp.send();
    }   
    
    const botonInforme = document.getElementById('informe');
    botonInforme.addEventListener('click', () => {
        contenedorPeliculas.style.display = 'none';
        peticionPorID2(peliculas);
        document.getElementById('cargando').style.display = 'hidden';

    });

    function peticionPorID2(arr) {
        for (let i = 0; i < arr.length; i++) {
            const linkID = 'https://www.omdbapi.com/?i=' + arr[i] + '&apikey=9a9fd1d2';
            const xhttp = new XMLHttpRequest();
    
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const datos = JSON.parse(this.responseText);
                    
                    detalles.push(datos);
                    if (detalles.length === arr.length) {
                        mostrarGraficas();
                    }
                }
            };
    
            xhttp.open("GET", linkID, true);
            xhttp.send();
        }
    }

    function mostrarGraficas() {
        contenedorPeliculas.style.display = 'none';
        document.getElementById('cerrar-img').style.display = 'inline';
        document.getElementById('cerrar-img').addEventListener('click', ()=>{
            document.getElementById('informes').style.display = 'none';
            document.getElementById('cerrar-img').style.display = 'none';
            location.href="https://jorgeherrero00.github.io/Buscador-Peliculas/";

        });

        var h2 = document.getElementsByTagName('h2');

        for (const h of h2) {
            h.style.display = 'block';
        }
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(() => {
            crearGraficaValoradas(detalles);
            crearGraficaRecaudacion(detalles)
            crearGraficaMasVotadas(detalles)
        });
    }

    function crearGraficaValoradas(peliculas) {

        var peliculas_ordenadas = peliculas.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
        let peliculasTop5 = peliculas_ordenadas.slice(0, 5);
    
        // Mostrar información de películas aparte de la gráfica
        let infoPeliculasContainer = document.getElementById('info-peliculas');
        infoPeliculasContainer.innerHTML = '';
        let peliculaInfoDiv = document.createElement('div');
        peliculaInfoDiv.className = 'pelicula-info';
        peliculaInfoDiv.style.display = 'flex';

        peliculasTop5.forEach((pelicula) => {
            let imageUrl = pelicula.Poster !== 'N/A' ? pelicula.Poster : './img/Imagen_no_disponible.svg.png';
    
            // Crear elementos para mostrar la información de las películas
    
            let img = document.createElement('img');
            img.src = imageUrl;
            img.alt = pelicula.Title;
            img.style.width = '205px';
            img.style.height = '275px';
            img.style.padding = '30px';
            img.style.objectFit = 'cover';
            img.style.margin = '0 auto';
    
            
            let tituloP = document.createElement('p');
            tituloP.innerText = pelicula.Title;
            tituloP.style.color = 'white';
    
            // Agregar elementos al contenedor de información de películas
            peliculaInfoDiv.appendChild(img);
            peliculaInfoDiv.appendChild(tituloP);
            infoPeliculasContainer.appendChild(peliculaInfoDiv);
            contenedorPeliculas.style.display = 'none';
        });
    
        // Crear la gráfica
        let data = [['Película', 'Rating']];
        peliculas.forEach((pelicula) => {
            data.push([pelicula.Title, parseFloat(pelicula.imdbRating)]);
        });
    
        let dataTable = new google.visualization.arrayToDataTable(data);
        let options = {
            title: 'Películas más valoradas por imdbRating',
            width: 600,
            height: 400,
            legend: { position: 'none' },
            backgroundColor: 'black',
            colors: ['white'],
            textStyle:{ color: 'white'}
        };
    
        let chart = new google.visualization.BarChart(document.getElementById('grafica-valoradas'));
        chart.draw(dataTable, options);
    }

    function crearGraficaRecaudacion(peliculas) {
        
        peliculas.forEach((pelicula) => {
        pelicula.numericBoxOffice = parseFloat(pelicula.BoxOffice.replace(/[^0-9.-]+/g, '')) || 0;
    });

    var peliculas_ordenadas_recaudacion = peliculas.sort((a, b) => b.numericBoxOffice - a.numericBoxOffice);
        let peliculas_top5 = peliculas_ordenadas_recaudacion.slice(0, 5);
    
        // Mostrar información de películas con mayor recaudación aparte de la gráfica
        let infoRecaudacionContainer = document.getElementById('info-recaudacion');
        infoRecaudacionContainer.innerHTML = '';
        let peliculaRecaudacionDiv = document.createElement('div');
        peliculaRecaudacionDiv.className = 'pelicula-recaudacion';
        peliculaRecaudacionDiv.style.display = 'flex';
    
        peliculas_top5.forEach((pelicula) => {
            let imageUrl = pelicula.Poster !== 'N/A' ? pelicula.Poster : './img/Imagen_no_disponible.svg.png';
    
            // Crear elementos para mostrar la información de las películas con mayor recaudación
            let img = document.createElement('img');
            img.src = imageUrl;
            img.alt = pelicula.Title;
            img.style.width = '205px';
            img.style.height = '275px';
            img.style.padding = '30px';
            img.style.objectFit = 'cover';
            img.style.margin = '0 auto';
    
            let tituloP = document.createElement('p');
            tituloP.innerText = pelicula.Title;
            tituloP.style.color = 'white';

    
            // Agregar elementos al contenedor de información de películas con mayor recaudación
            peliculaRecaudacionDiv.appendChild(img);
            peliculaRecaudacionDiv.appendChild(tituloP);
            infoRecaudacionContainer.appendChild(peliculaRecaudacionDiv);
        });
    
        // Crear la gráfica
        let data = [['Película', 'Recaudación']];
        peliculas.forEach((pelicula) => {
            data.push([pelicula.Title, parseFloat(pelicula.BoxOffice.replace(/[^0-9.-]+/g, ''))]);
        });
    
        let dataTable = new google.visualization.arrayToDataTable(data);
        let options = {
            title: 'Películas con mayor recaudación',
            width: 600,
            height: 400,
            legend: { position: 'none' },
            backgroundColor: 'black',
            colors: ['white'],
            textStyle: { color: 'white' },
            vAxis: { format: 'currency' }, // Formato de la etiqueta del eje vertical como moneda
        };
    
        let chart = new google.visualization.BarChart(document.getElementById('grafica-recaudacion'));
        chart.draw(dataTable, options);
    }


    function crearGraficaMasVotadas(peliculas) {
        
        var peliculas_votadas = peliculas.sort((a, b) => parseFloat(b.imdbVotes) - parseFloat(a.imdbVotes));
        let peliculasTop5 = peliculas_votadas.slice(0, 5);
    
        // Mostrar información de películas más votadas aparte de la gráfica
        let infoMasVotadasContainer = document.getElementById('info-mas-votadas');
        infoMasVotadasContainer.innerHTML = '';
        let peliculaMasVotadaDiv = document.createElement('div');
        peliculaMasVotadaDiv.className = 'pelicula-mas-votada';
        peliculaMasVotadaDiv.style.display = 'flex';
    
        peliculasTop5.forEach((pelicula) => {
            let imageUrl = pelicula.Poster !== 'N/A' ? pelicula.Poster : './img/Imagen_no_disponible.svg.png';
    
            // Crear elementos para mostrar la información de las películas más votadas
            let img = document.createElement('img');
            img.src = imageUrl;
            img.alt = pelicula.Title;
            img.style.width = '205px';
            img.style.height = '275px';
            img.style.padding = '30px';
            img.style.objectFit = 'cover';
            img.style.margin = '0 auto';
    
            let tituloP = document.createElement('p');
            tituloP.innerText = pelicula.Title;
            tituloP.style.color = 'white';

    
            // Agregar elementos al contenedor de información de películas más votadas
            peliculaMasVotadaDiv.appendChild(img);
            peliculaMasVotadaDiv.appendChild(tituloP);
            infoMasVotadasContainer.appendChild(peliculaMasVotadaDiv);
        });
    
        // Crear la gráfica
        let data = [['Película', 'Votos']];
        peliculas.forEach((pelicula) => {
            data.push([pelicula.Title, parseFloat(pelicula.imdbVotes.replace(/[^0-9.-]+/g, ''))]);
        });
    
        let dataTable = new google.visualization.arrayToDataTable(data);
        let options = {
            title: 'Películas más votadas',
            width: 600,
            height: 400,
            legend: { position: 'none' },
            backgroundColor: 'black',
            colors: ['white'],
            textStyle: { color: 'white' },
            vAxis: { format: 'decimal' }, // Formato de la etiqueta del eje vertical como número decimal
        };
    
        let chart = new google.visualization.BarChart(document.getElementById('grafica-mas-votadas'));
        chart.draw(dataTable, options);
    }
}

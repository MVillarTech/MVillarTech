// Variables 

const formulario = document.querySelector('#formulario');
const listaTweeets = document.querySelector('#lista-tweets');
let tweets = [];

// Event Listeners 

evetListeners();
function evetListeners() {
    // Cuando el usuario agrega un nuevo tweet
    formulario.addEventListener('submit', agregarTweet);

    // Cuando el documento esta listo 
    document.addEventListener('DOMContentLoaded', () => {
        tweets = JSON.parse(localStorage.getItem('tweets')) || [];

        console.log(tweets);

        crearHTML();
    });
} 

// Funciones 

function agregarTweet(e) {
    e.preventDefault();

    // console.log('Agregando tweet');

    // Textarea donde el usuario escribe 

    const tweet = document.querySelector('#tweet').value;

    // Validacion 

    if(tweet === '') {
        mostrarError('El tweeet no puede ir vacio');

        return; // Evita que se ejecuten mas lineas de codigo
    }

    const tweetObj = {
        id: Date.now(),
        tweet // Aqui llave y valor se llaman de la misma manera, es igual que poner tweet: tweet
    }

    // console.log('Agregando tweet');

    // Añadir al arreglo de tweets 
    tweets = [...tweets, tweetObj];
    // console.log(tweets);

    // Una vez agregado, vamos a crear el HTML
    crearHTML();

    // Reiniciar el formulario
    formulario.reset();
}

// Mostrar mensaje de error 

function mostrarError(error) {
    const mensajeError = document.createElement('p');
    mensajeError.textContent = error;
    mensajeError.classList.add('error');

    // Insertarlo en el contenido
    const contenido = document.querySelector('#contenido');
    contenido.appendChild(mensajeError);

    // Elimina la alerta despues de 3"
    setTimeout(() => {
        mensajeError.remove();
    }, 3000);
}

// Muestra un listado de los tweets 

function crearHTML() {

    limpiarHTML();

    if(tweets.length > 0) {
        tweets.forEach(tweet => {

            // Agregar un boton de eliminar 
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tweet');
            btnEliminar.innerText = 'X';

            // Añadir la funcion de eliminar 
            btnEliminar.onclick = () => {
                borrarTweet(tweet.id);
            }


            // Crear el HTML 

            const li = document.createElement('li');

            // Añadir el texto 
            li.innerText = tweet.tweet;

            // Asignar el boton de eliminar 

            li.appendChild(btnEliminar);

            // Insertarlo en el HTML 
            listaTweeets.appendChild(li);
        });
    }

    sincronizarStorage();
}

// Agrega los tweets actuales al localStorage 

function sincronizarStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweets));
}

// Elimina un tweet 

function borrarTweet(id) {
    // console.log('Borrando', id);
    tweets = tweets.filter(tweet => tweet.id !== id);

    // console.log(tweets);

    crearHTML();
}


// Limpiar el HTML 

function limpiarHTML() {
    while(listaTweeets.firstChild) {
        listaTweeets.removeChild(listaTweeets.firstChild);
    }
}

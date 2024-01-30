// Variables y selectores


const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
 




// Eventos


eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);


    // Añadir validacion al formulario
    formulario.addEventListener('submit', agregarGasto);
}

// Clases


class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }


    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }
   
    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;


        // console.log(this.restante);
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id );
        this.calcularRestante();
    }
}


class UI {
    insertarPresupuesto(cantidad) {
        // console.log(cantidad);
        // Extrayendo los valores
        const {presupuesto, restante} = cantidad;


        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }


    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert'); // Bootstrap


        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;


        // Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);


        // Quitar del HTML


        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }


    mostrarGastos(gastos) {


        this.limpiarHTML(); // Elimina el HTML previo
       


        // Iterar sobre los gastos
        gastos.forEach( gasto => {


            const {cantidad, nombre, id} = gasto;


            // Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'; // Te notifica de las clases que hay  
            // nuevoGasto.setAttribute('data-id', id); // Vieja formulación
            nuevoGasto.dataset.id; // Nueva version de JS, se recomienda esta

                // console.log(nuevoGasto);


            // Agregar un HTML del gasto
            nuevoGasto.innerHTML = ` ${nombre} <span class="badge badge-primary badge-pill"> ${cantidad} € </span>`;


            // Boton para borrar el gasto
            const btnBorarr = document.createElement('button');
            btnBorarr.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorarr.innerHTML = ('Borrar &times');
            btnBorarr.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorarr);


            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        })
    }


    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }


    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }


    comprobarPresupuesto(presupuestObj) {
        const {presupuesto, restante} = presupuestObj;


        const restanteDiv = document.querySelector('.restante');

        // Comprobar 25%
        if((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si el total es 0 o menor
        if(restante <=0) {
            ui.imprimirAlerta('El presupuesto se ha acabado', 'error');


            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}


// Instanciar
const ui = new UI();
let presupuesto;


// Funciones


function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');

    // console.log(Number(presupuestoUsuario)); // ParseInt convierte los numeros string en enteros // ParseFloat lo hace con los decimales // Number solo te deja poner numeros

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) { // isNan verifica que si trata de convertir el presupuestoUsuario en numero y devuelve isNan, devuelve true
        window.location.reload();
    }

    // Presupuesto valido
     presupuesto = new Presupuesto(presupuestoUsuario);
     console.log(presupuesto);

     ui.insertarPresupuesto(presupuesto);
}


// Añade gastos
function agregarGasto(e) {
    e.preventDefault();


    // Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);


    // Validar
    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error');


        return;
    }

    // Generar un objeto con el gasto -> Object literal
    const gasto = {nombre, cantidad, id: Date.now()} // Es lo contrario a un destructuring, une nombre y cantidad a gasto
        // Destructuring
            // const {nombre, cantidad} = gasto; // Esto extrae nombre y cantidad de gasto


    // Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);


    // Mensaje de que esta todo correctamente rellenado
    ui.imprimirAlerta('Gasto agregado correctamente');


    // Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);


    // Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    // Elimina del objeto
    presupuesto.eliminarGasto(id);

    // Elimina los gastos del HTML 
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
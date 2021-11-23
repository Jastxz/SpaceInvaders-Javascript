/* 
 Nombre y apellidos: Javier Gil Blázquez
 Uvus: javgilbla
 Cambios con respecto al vídeo de referencia:
    -Tamaño aumentado en general.
    -Modificado patrón de colores.
    -Modificados los intervalos de tiempo para intentar añadir progresión de dificultad.
    -Añadidos búnkers parecidos a los originales con sus respectivas interacciones.
    -Añadida variable "finalizado" para evitar búsquedas infinitas que ocurrían 
        bajo ciertas condiciones una vez acabado el juego
    -Añadidos cambios visuales en la interacción de fin de pantalla
    -Intentado arreglar un error que hace que al recargar la página la música de los aliens
        siga pausada si ha sido pausada anteriormente(como al terminar el juego). Además de 
        iniciarse automáticamente el sonido para las fases siguientes del juego. Se ha dejado 
        por imposible. Dejaré comentado todo aquello que se intentó por última vez para 
        solucionar el error.
    -Arrelado error que permitía moverse y disparar tras finalizar el juego provocando
        interacciones no previstas.
    - Modificado css para usar imágenes lo más parecidas al original posible.

 Referencias: 
    -https://www.youtube.com/watch?v=kSt2_YZzCec&feature=youtu.be
    -https://www.youtube.com/watch?v=MU4psw3ccUI(vídeo para referenciarme más correctamente sobre el juego)
    -https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval
    -https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
    -https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
    -https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    -https://developer.mozilla.org/es/docs/Web/API/Element/classList
    -https://developer.mozilla.org/es/docs/Web/HTML/Elemento/meta
    -https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/remove
    -https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap
    -https://developer.mozilla.org/es/docs/Web/HTML/Usando_audio_y_video_con_HTML5
    -http://www.classicgaming.cc/classics/space-invaders/sounds
    -https://www.w3schools.com/tags/av_prop_src.asp
    -https://www.w3schools.com/jsref/event_onclick.asp
    -https://developer.mozilla.org/es/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML
*/

document.addEventListener("DOMContentLoaded", ()=> {

    // Variables de acceso al DOM
    const cuadrados = document.querySelectorAll(".espacio div")
    const puntuacionDinamica = document.querySelector("#puntuacion")

    // Audio DOM 1
    const fastinvader = document.getElementById('fastinvader')
    //const playInv = document.getElementById("playInvasores")
    const pausaInv = document.getElementById("pausaInvasores")
    //const suenaMusica = true

    // Audio DOM 2
    const explosion = document.getElementById("explosion")
    const invaderkilled = document.getElementById("invaderkilled")
    const shoot = document.getElementById("shoot")

    // Definición variables auxiliares del documento
    let width = 33
    let posicionActualJ = 412
    let aliensMuertos = []
    let puntuacion = 0
    let direccion = 1
    let alienId = 0
    let finalizado = false

    //Definimos los invasores alienígenas
    const invasorAlien = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,
        33,34,35,36,37,38,39,40,41,42,43,
        66,67,68,69,70,71,72,73,74,75,76
    ]

    // Definimos los búnkers de protección del jugador
    const protecciones = [
        333,334,335, 341,342,343, 349,350,351, 357,358,359, 
        366,    368, 374,    376, 382,    384, 390,    392
    ]

    function comienzo(){
        // Dibujamos a los alienígenas
        invasorAlien.forEach( alien => cuadrados[alien].classList.add("enemigo"))

        // Dibujamos al jugador
        cuadrados[posicionActualJ].classList.add("jugador")

        // Dibujamos los búnkers
        protecciones.forEach( b => cuadrados[b].classList.add("proteccion"))

        // Aplicamos el intervalo de movimiento para los aliens
        alienId = setInterval(mAliens,1000)

        // Inicializamos la variable src de fastinvader
        fastinvader.src = "Sonidos/fastinvader1.wav"
        //playInv.click()
        
    }

    // Movimiento del jugador
    function mJugador(e){
        if (finalizado == false) {
            cuadrados[posicionActualJ].classList.remove("jugador")
            switch (e.keyCode) {
                case 37:
                    if (posicionActualJ % width !== 0) {
                        posicionActualJ -= 1
                    }
                    break;
        
                case 39:
                    if (posicionActualJ % width < width - 1) {
                        posicionActualJ += 1
                    }
                    break;
            }
            cuadrados[posicionActualJ].classList.add("jugador")
        }
    }

    // Gestión de los aliens. Movimiento, protectores del jugador,victoria y derrota
    function mAliens() {

        // Movimiento
        const limiteIz = invasorAlien[0] % width === 0
        const limiteDe = invasorAlien[invasorAlien.length - 1] % width === width - 1

        if((limiteIz && direccion === -1) || (limiteDe && direccion === 1)){
            direccion = width
        }else if(direccion === width){
            if(limiteIz){
                direccion = 1
            }else{
                direccion = -1
            }
        }
        for(let i = 0; i <= invasorAlien.length - 1;i++) {
            if(finalizado){
                break
            }else{
                cuadrados[invasorAlien[i]].classList.remove("enemigo")
            }
        }
        for(let i = 0; i <= invasorAlien.length - 1;i++) {
            if(finalizado){
                break
            }else{
                invasorAlien[i] += direccion
            }
        }
        for(let i = 0; i <= invasorAlien.length - 1;i++) {
            if(finalizado){
                break
            }else{
                if(!aliensMuertos.includes(i)){
                    cuadrados[invasorAlien[i]].classList.add("enemigo")
                }
            }
        }

        // Gestiona choque con estructuras búnker
        protecciones.forEach(p => {
            if(cuadrados[p].classList.contains("enemigo")){
                cuadrados[p].classList.remove("proteccion")
            }
        })

        // Gestiona Fin de partida. Modificación: pausamos la música tambén tras añadirla
        if(cuadrados[posicionActualJ].classList.contains("enemigo","jugador")){
            puntuacionDinamica.textContent = "Has perdido"
            cuadrados[posicionActualJ].classList.add("explosion")
            clearInterval(alienId)
            pausaInv.click()
            finalizado = true
        }
        for(let i = 0; i <= invasorAlien.length - 1;i++) {
            if(invasorAlien[i] > (cuadrados.length - (width - 1))){
                puntuacionDinamica.textContent = "Has perdido"
                cuadrados[posicionActualJ].classList.add("explosion")
                clearInterval(alienId)
                pausaInv.click()
                finalizado = true
            }
        }

        // Gestiona victoria. Modificación: pausamos la música tambén tras añadirla
        if(aliensMuertos.length === invasorAlien.length){
            puntuacionDinamica.textContent = "Has ganado"
            clearInterval(alienId)
            pausaInv.click()
            finalizado = true
        }

        
    }

    // Definimos cómo vamos a disparar y las interacciones del láser con el entorno
    function disparar(e){
        let laserId
        let posicionActualL = posicionActualJ

        // Recorrido del disparo y gestión de colisiones con protecciones y aliens
        function mLaser(){
            cuadrados[posicionActualL].classList.remove("disparo")
            posicionActualL -= width
            cuadrados[posicionActualL].classList.add("disparo")

            // Choque con protecciones
            if(cuadrados[posicionActualL].classList.contains("proteccion")){
                cuadrados[posicionActualL].classList.remove("disparo","proteccion")
                cuadrados[posicionActualL].classList.add("explosion")

                explosion.play()
                setTimeout( () => cuadrados[posicionActualL].classList.remove("explosion"),250)
                clearInterval(laserId)

            // Eliminación de enemigos
            }else if(cuadrados[posicionActualL].classList.contains("enemigo")){
                cuadrados[posicionActualL].classList.remove("disparo")
                cuadrados[posicionActualL].classList.remove("enemigo")
                cuadrados[posicionActualL].classList.add("explosion")

                invaderkilled.play()
                setTimeout( () => cuadrados[posicionActualL].classList.remove("explosion"),250)
                clearInterval(laserId)

                // Actualizamos la lista de aliens muertos y la velocidad de movimiento de estos
                // Modificación: Añadida música
                const alienMuerto = invasorAlien.indexOf(posicionActualL)
                aliensMuertos.push(alienMuerto)
                let lAliensMuertos = aliensMuertos.length
                if(lAliensMuertos > 20){
                    alienId = setInterval(mAliens,850)

                    fastinvader.src = "Sonidos/fastinvader4.wav"
                    /*if (suenaMusica == false) {
                        pausaInv.click()
                    }else{
                        playInv.click()
                    }*/
                }else if(lAliensMuertos > 15){
                    alienId = setInterval(mAliens,900)

                    fastinvader.src = "Sonidos/fastinvader3.wav"
                    /*if (suenaMusica == false) {
                        pausaInv.click()
                    }else{
                        playInv.click()
                    }*/
                }else if(lAliensMuertos > 9){
                    alienId = setInterval(mAliens,950)
                }else if(lAliensMuertos > 4){
                    alienId = setInterval(mAliens,975)

                    // Actualización de música
                    fastinvader.src = "Sonidos/fastinvader2.wav"
                    /*if (suenaMusica == false) {
                        pausaInv.click()
                    }else{
                        playInv.click()
                    }*/
                }

                // Modificamos la puntuación
                puntuacion++
                puntuacionDinamica.textContent = puntuacion
            }

            if(posicionActualL < width){
                clearInterval(laserId)
                setTimeout( () => cuadrados[posicionActualL].classList.remove("disparo"),50)
            }
        }

        if (finalizado == false) {
            switch (e.keyCode) {
                case 32:
                    laserId = setInterval(mLaser,20)
                    shoot.play()
                    break;
                default:
                    break;
            }
        }
        
    }

    // Funciones para gestionar la música
    /*function iniciaM(){
        if (suenaMusica == false) {
            playInv.click()
        }
    }*/

    // Gestores de eventos
    document.addEventListener("keydown",mJugador)
    document.addEventListener("keyup", disparar)
    //playInv.addEventListener("DOMContentLoaded", iniciaM)

    // Función de comienzo
    comienzo()
})
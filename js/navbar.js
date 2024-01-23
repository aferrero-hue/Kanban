document.addEventListener('DOMContentLoaded', function () {
    // Obtén el botón abrir y las opciones del menú
    const abrirBtn = document.querySelector('.abrir');
    const menuOptions = document.querySelector('.menu-options');

    // Oculta las opciones del menú por defecto en dispositivos móviles y tabletas
    if (window.innerWidth <= 850) {
      menuOptions.style.display = 'none';
    }

    // Función para mostrar/ocultar el menú en dispositivos móviles
    function toggleMenu() {
      if (window.innerWidth <= 850) { // Verifica el ancho de la pantalla en dispositivos móviles
        // Cambia la propiedad display de las opciones del menú en dispositivos móviles y tabletas
        menuOptions.style.display = (menuOptions.style.display === 'none') ? 'block' : 'none';
      }
    }

    // Agrega un evento de clic al botón abrir en dispositivos móviles
    abrirBtn.addEventListener('click', toggleMenu);

    // Maneja la visibilidad del menú al cambiar el tamaño de la ventana
    window.addEventListener('resize', function () {
      if (window.innerWidth > 850) {
        menuOptions.style.display = 'block'; // En desktop, muestra las opciones por defecto
      } else if (menuOptions.style.display !== 'none') {
        toggleMenu(); // En dispositivos móviles, ajusta la visibilidad del menú según el ancho de la pantalla
      }
    });
  });
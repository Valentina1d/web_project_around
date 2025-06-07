const popup = document.querySelector('.popup');
const openButton = document.querySelector('.profile__edit-button');
const closeButton = popup.querySelector('.popup__close-button');

const nameInput = document.querySelector('.popup__input[name="name"]');
const jobInput = document.querySelector('.popup__input[name="about"]');
const nameDisplay = document.querySelector('.profile__name');
const jobDisplay = document.querySelector('.profile__description');
const formElement = document.querySelector('.popup__form');

// Abrir popup y cargar valores actuales
openButton.addEventListener('click', () => {
  nameInput.value = nameDisplay.textContent;
  jobInput.value = jobDisplay.textContent;
  popup.classList.add('popup_opened');
});

// Cerrar popup
closeButton.addEventListener('click', () => {
  popup.classList.remove('popup_opened');
});

// Guardar los datos del formulario y actualizar la página
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  nameDisplay.textContent = nameInput.value;
  jobDisplay.textContent = jobInput.value;
  popup.classList.remove('popup_opened');
}

formElement.addEventListener('submit', handleProfileFormSubmit);
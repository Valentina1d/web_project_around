import { Card } from './components/Card.js';
import { FormValidator } from './components/FormValidator.js';
 
const popup = document.querySelector('.popup');
const openButton = document.querySelector('.profile__edit-button');
const closeButton = popup.querySelector('.popup__close-button');
 
const nameInput = document.querySelector('.popup__input[name="name"]');
const jobInput = document.querySelector('.popup__input[name="about"]');
const nameDisplay = document.querySelector('.profile__name');
const jobDisplay = document.querySelector('.profile__description');
const formElement = document.querySelector('.popup__form');
 
openButton.addEventListener('click', () => {
  nameInput.value = nameDisplay.textContent;
  jobInput.value = jobDisplay.textContent;
  popup.classList.add('popup_opened');
});
 
closeButton.addEventListener('click', () => {
  popup.classList.remove('popup_opened');
});
 
formElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  nameDisplay.textContent = nameInput.value;
  jobDisplay.textContent = jobInput.value;
  popup.classList.remove('popup_opened');
});
 
const initialCards = [
  { name: "Valle de Yosemite", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/yosemite.jpg" },
  { name: "Lago Louise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lake-louise.jpg" },
  { name: "Montañas Calvas", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/bald-mountains.jpg" },
  { name: "Latemar", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/latemar.jpg" },
  { name: "Parque Nacional de la Vanoise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/vanoise.jpg" },
  { name: "Lago di Braies", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lago.jpg" }
];
 
const galleryContainer = document.querySelector('.gallery');
initialCards.forEach((cardData) => {
  const card = new Card(cardData, '#card-template');
  const cardElement = card.generateCard();
  galleryContainer.append(cardElement);
});
 
 
const addButton = document.querySelector('.profile__add-button');
const addPopup = document.querySelector('.popup_type_add');
const addCloseButton = addPopup.querySelector('.popup__close-button');
const addForm = addPopup.querySelector('.popup__form');
const titleInput = addForm.querySelector('input[name="title"]');
const linkInput = addForm.querySelector('input[name="image"]');
 
addButton.addEventListener('click', () => {
  addForm.reset();
  addPopup.classList.add('popup_opened');
});
 
addCloseButton.addEventListener('click', () => {
  addPopup.classList.remove('popup_opened');
});
 
addForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newCard = {
    name: titleInput.value,
    link: linkInput.value
  };
const card = new Card(newCard, '#card-template');
const cardElement = card.generateCard();
  galleryContainer.prepend(cardElement);
  addPopup.classList.remove('popup_opened');
});
 
function openImagePopup(src, alt) {
  const popupImage = document.querySelector('.popup_type_image');
  const popupImg = popupImage.querySelector('.popup__image');
  const popupCaption = popupImage.querySelector('.popup__caption');
 
  popupImg.src = src;
  popupImg.alt = alt;
  popupCaption.textContent = alt;
 
  popupImage.classList.add('popup_opened');
}
 
document.querySelector('.popup_type_image .popup__close-button').addEventListener('click', () => {
  document.querySelector('.popup_type_image').classList.remove('popup_opened');
});
 
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__save-button',
  inactiveButtonClass: 'popup__save-button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};
 
const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
formList.forEach((formElement) => {
  const formValidator = new FormValidator(validationConfig, formElement);
  formValidator.enableValidation();
});
 
document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('mousedown', (event) => {
    if (event.target === popup) {
      popup.classList.remove('popup_opened');
    }
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_opened');
    if (openedPopup) {
      openedPopup.classList.remove('popup_opened');
    }
  }
});
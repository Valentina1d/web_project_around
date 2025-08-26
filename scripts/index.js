import { Card } from './components/Card.js';
import { FormValidator } from './components/FormValidator.js';
import { Api } from './components/Api.js';

let userId = '';

const api = new Api({
  baseUrl: 'https://around-api.es.tripleten-services.com/v1',
  headers: {
    authorization: 'cb49332f-b60e-4852-83f5-aea00bb346c2',
    'Content-Type': 'application/json'
  }
});

// -------------------- Elementos del DOM --------------------
const popup = document.querySelector('.popup');
const openButton = document.querySelector('.profile__edit-button');
const closeButton = popup.querySelector('.popup__close-button');
const nameInput = document.querySelector('.popup__input[name="name"]');
const jobInput = document.querySelector('.popup__input[name="about"]');
const nameDisplay = document.querySelector('.profile__name');
const jobDisplay = document.querySelector('.profile__description');
const avatarImage = document.querySelector('.profile__avatar');
const formElement = document.querySelector('.popup__form');
const galleryContainer = document.querySelector('.gallery');

const addButton = document.querySelector('.profile__add-button');
const addPopup = document.querySelector('.popup_type_add');
const addCloseButton = addPopup.querySelector('.popup__close-button');
const addForm = addPopup.querySelector('.popup__form');
const titleInput = addForm.querySelector('input[name="title"]');
const linkInput = addForm.querySelector('input[name="image"]');

const confirmPopup = document.querySelector('.popup_type_confirm');
const confirmForm = confirmPopup.querySelector('.popup__form');
let cardToDelete = null;

// -------------------- Funciones --------------------

function openImagePopup(src, alt) {
  const popupImage = document.querySelector('.popup_type_image');
  const popupImg = popupImage.querySelector('.popup__image');
  const popupCaption = popupImage.querySelector('.popup__caption');

  popupImg.src = src;
  popupImg.alt = alt;
  popupCaption.textContent = alt;
  popupImage.classList.add('popup_opened');
}

function openConfirmPopup(cardData) {
  cardToDelete = cardData;
  confirmPopup.classList.add('popup_opened');
}

function closeConfirmPopup() {
  confirmPopup.classList.remove('popup_opened');
  cardToDelete = null;
}

// -------------------- Cargar usuario y tarjetas --------------------

api.getUserInfo()
  .then(userData => {
    userId = userData._id;
    nameDisplay.textContent = userData.name;
    jobDisplay.textContent = userData.about;
    avatarImage.src = userData.avatar;

    return api.getInitialCards();
  })
  .then(cards => {
    cards.forEach(cardData => {
      const card = new Card(
        cardData,
        '#card-template',
        openImagePopup,
        (cardInstance) => {
          const isLiked = cardInstance._isLikedByUser();
          const likeAction = isLiked ? api.unlikeCard(cardInstance._id) : api.likeCard(cardInstance._id);
          likeAction
            .then(updatedCard => {
              cardInstance.updateLikes(updatedCard.likes);
            })
            .catch(err => console.log('Error al dar like/unlike:', err));
        },
        (cardId, cardElement) => {
          cardToDelete = { id: cardId, element: cardElement };
          confirmPopup.classList.add('popup_opened');
        },
        userId
      );
      const cardElement = card.generateCard();
      galleryContainer.append(cardElement);
    });
  })
  .catch(err => console.log('Error al cargar usuario o tarjetas:', err));

// -------------------- Editar perfil --------------------

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
  const newName = nameInput.value;
  const newAbout = jobInput.value;

  api.updateUserInfo({ name: newName, about: newAbout })
    .then(updatedUser => {
      nameDisplay.textContent = updatedUser.name;
      jobDisplay.textContent = updatedUser.about;
      popup.classList.remove('popup_opened');
    })
    .catch(err => console.log('Error al actualizar perfil:', err));
});

// -------------------- Añadir nueva tarjeta --------------------

addButton.addEventListener('click', () => {
  addForm.reset();
  addPopup.classList.add('popup_opened');
});

addCloseButton.addEventListener('click', () => {
  addPopup.classList.remove('popup_opened');
});

addForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newCardData = {
    name: titleInput.value,
    link: linkInput.value
  };

  api.addCard(newCardData)
    .then((createdCard) => {
      const card = new Card(
        createdCard,
        '#card-template',
        openImagePopup,
        (cardInstance) => {
          const isLiked = cardInstance._isLikedByUser();
          const likeAction = isLiked ? api.unlikeCard(cardInstance._id) : api.likeCard(cardInstance._id);
          likeAction
            .then(updatedCard => {
              cardInstance.updateLikes(updatedCard.likes);
            })
            .catch(err => console.log('Error al dar like/unlike:', err));
        },
        (cardId, cardElement) => {
          cardToDelete = { id: cardId, element: cardElement };
          confirmPopup.classList.add('popup_opened');
        },
        userId
      );
      const cardElement = card.generateCard();
      galleryContainer.prepend(cardElement);
      addPopup.classList.remove('popup_opened');
    })
    .catch(err => console.log('Error al agregar tarjeta:', err));
});

// -------------------- Popup imagen --------------------

document.querySelector('.popup_type_image .popup__close-button').addEventListener('click', () => {
  document.querySelector('.popup_type_image').classList.remove('popup_opened');
});

// -------------------- Popup de confirmación --------------------

confirmForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (cardToDelete) {
    api.deleteCard(cardToDelete.id)
      .then(() => {
        cardToDelete.element.remove();
        closeConfirmPopup();
      })
      .catch(err => console.log('Error al eliminar tarjeta:', err));
  }
});

confirmPopup.querySelector('.popup__close-button').addEventListener('click', closeConfirmPopup);

// -------------------- Validación --------------------

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

// -------------------- Cerrar popups con clic o Escape --------------------

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

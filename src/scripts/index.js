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


const editPopup = document.querySelector('.popup');
const openButton = document.querySelector('.profile__edit-button');
const closeButton = editPopup.querySelector('.popup__close-button');
const formElement = editPopup.querySelector('.popup__form');

const nameInput = editPopup.querySelector('.popup__input[name="name"]');
const jobInput  = editPopup.querySelector('.popup__input[name="about"]');

const nameDisplay = document.querySelector('.profile__name');
const jobDisplay  = document.querySelector('.profile__description');
const avatarImage = document.querySelector('.profile__avatar');


const galleryContainer = document.querySelector('.gallery');


const addButton = document.querySelector('.profile__add-button');
const addPopup  = document.querySelector('.popup_type_add');
const addCloseButton = addPopup.querySelector('.popup__close-button');
const addForm   = addPopup.querySelector('.popup__form');
const titleInput = addForm.querySelector('input[name="title"]');
const linkInput  = addForm.querySelector('input[name="image"]');
const addSubmitBtn = addForm.querySelector('.popup__save-button');


const imagePopup = document.querySelector('.popup_type_image');
const imagePopupClose = imagePopup.querySelector('.popup__close-button');
const popupImg = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');


const confirmPopup = document.querySelector('.popup_type_confirm');
const confirmForm  = confirmPopup.querySelector('.popup__form');
const confirmCloseBtn = confirmPopup.querySelector('.popup__close-button');
const confirmSubmitBtn = confirmPopup.querySelector('.popup__save-button');

let cardToDelete = null;

const avatarEditBtn   = document.querySelector('.profile__avatar-edit');
const avatarPopup     = document.querySelector('.popup_type_avatar');
const avatarCloseBtn  = avatarPopup.querySelector('.popup__close-button');
const avatarForm      = avatarPopup.querySelector('.popup__form');
const avatarInput     = avatarForm.querySelector('input[name="avatar"]');
const avatarSubmitBtn = avatarForm.querySelector('.popup__save-button');



function openImagePopup(src, alt) {
  popupImg.src = src;
  popupImg.alt = alt;
  popupCaption.textContent = alt || '';
  imagePopup.classList.add('popup_opened');
}

function openConfirmPopup(payload) {
  if (payload && payload.id && payload.element) {
    cardToDelete = payload;
  }
 
  confirmSubmitBtn.disabled = false;
  confirmSubmitBtn.classList.remove('popup__save-button_disabled');
  confirmPopup.classList.add('popup_opened');
}

function closeConfirmPopup() {
  confirmPopup.classList.remove('popup_opened');
  cardToDelete = null;
}


function makeCard(cardData) {
  const card = new Card(
    cardData,
    '#card-template',

   
    (link, name) => openImagePopup(link, name),


(cardInstance) => {
  const btn = cardInstance._likeButton;
  const id  = cardInstance._id;
  const wasLiked = cardInstance._isLikedByUser();

  
  const before = Array.isArray(cardInstance._likes) ? [...cardInstance._likes] : [];

  const optimistic = wasLiked
    ? before.filter(like => (typeof like === 'string' ? like : like && like._id) !== userId)
    : [...before, { _id: userId }];

  cardInstance.updateLikes(optimistic);

  if (btn) btn.disabled = true;
  const req = wasLiked ? api.unlikeCard(id) : api.likeCard(id);

  req
    .then(payload => {
      
      const serverLikes =
        (payload && Array.isArray(payload.likes) && payload.likes) ||
        (payload && payload.data && Array.isArray(payload.data.likes) && payload.data.likes) ||
        (payload && payload.card && Array.isArray(payload.card.likes) && payload.card.likes) ||
        null;

      if (serverLikes) {
        cardInstance.updateLikes(serverLikes);
      } 
    })
    .catch(err => {
      console.log('Error al dar like/unlike:', err);
      
      cardInstance.updateLikes(before);
    })
    .finally(() => {
      if (btn) btn.disabled = false;
    });
},


   
    (cardId, cardElement) => openConfirmPopup({ id: cardId, element: cardElement }),

    userId
  );

  return card.generateCard();
}

api.getUserInfo()
  .then(userData => {
    userId = userData._id;
    nameDisplay.textContent = userData.name;
    jobDisplay.textContent = userData.about;
    avatarImage.src = userData.avatar;
    return api.getInitialCards();
  })
  .then(cards => {
    galleryContainer.innerHTML = '';
    cards.forEach(cardData => {
      
      if (!cardData.owner) cardData.owner = { _id: cardData.ownerId || userId || '' };
      const cardElement = makeCard(cardData);
      galleryContainer.append(cardElement);
    });
  })
  .catch(err => console.log('Error al cargar usuario o tarjetas:', err));


openButton.addEventListener('click', () => {
  nameInput.value = nameDisplay.textContent;
  jobInput.value  = jobDisplay.textContent;
  editPopup.classList.add('popup_opened');
});

closeButton.addEventListener('click', () => {
  editPopup.classList.remove('popup_opened');
});

formElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newName  = nameInput.value.trim();
  const newAbout = jobInput.value.trim();

  api.updateUserInfo({ name: newName, about: newAbout })
    .then(updatedUser => {
      nameDisplay.textContent = updatedUser.name;
      jobDisplay.textContent  = updatedUser.about;
      editPopup.classList.remove('popup_opened');
    })
    .catch(err => console.log('Error al actualizar perfil:', err));
});

function syncAddSubmitState() {
  const valid = addForm.checkValidity();
  addSubmitBtn.disabled = !valid;
  addSubmitBtn.classList.toggle('popup__save-button_disabled', !valid);
}


addButton.addEventListener('click', () => {
  addForm.reset();
  syncAddSubmitState();
  addPopup.classList.add('popup_opened');
});

addCloseButton.addEventListener('click', () => {
  addPopup.classList.remove('popup_opened');
});

addForm.addEventListener('input', syncAddSubmitState);

addForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const defaultTxt = addSubmitBtn.textContent;
  addSubmitBtn.textContent = 'Guardando...';
  addSubmitBtn.disabled = true;

  const newCardData = {
    name: titleInput.value.trim(),
    link: linkInput.value.trim()
  };

  api.addCard(newCardData)
    .then((createdCard) => {
      if (!createdCard.owner) createdCard.owner = { _id: userId };
      const cardElement = makeCard(createdCard);
      galleryContainer.prepend(cardElement);
      addPopup.classList.remove('popup_opened');
      addForm.reset();
      syncAddSubmitState();
    })
    .catch(err => console.log('Error al agregar tarjeta:', err))
    .finally(() => {
      addSubmitBtn.textContent = defaultTxt;
      syncAddSubmitState();
    });
});

avatarEditBtn.addEventListener('click', () => {
  avatarForm.reset();
  syncAvatarSubmitState();            
  avatarPopup.classList.add('popup_opened');
});


avatarCloseBtn.addEventListener('click', () => {
  avatarPopup.classList.remove('popup_opened');
});


function syncAvatarSubmitState() {
  const valid = avatarForm.checkValidity();
  avatarSubmitBtn.disabled = !valid;
  avatarSubmitBtn.classList.toggle('popup__save-button_disabled', !valid);
}
avatarForm.addEventListener('input', syncAvatarSubmitState);


avatarForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = avatarInput.value.trim();

  const defaultTxt = avatarSubmitBtn.textContent;
  avatarSubmitBtn.textContent = 'Guardando...';
  avatarSubmitBtn.disabled = true;

  api.updateAvatar({ avatar: url })
    .then(user => {
     
      avatarImage.src = user.avatar;
      avatarPopup.classList.remove('popup_opened');
    })
    .catch(err => console.log('Error al actualizar avatar:', err))
    .finally(() => {
      avatarSubmitBtn.textContent = defaultTxt;
      syncAvatarSubmitState();
    });
});



imagePopupClose.addEventListener('click', () => {
  imagePopup.classList.remove('popup_opened');
});


confirmForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!cardToDelete) return;

  const defaultTxt = confirmSubmitBtn.textContent;
  confirmSubmitBtn.textContent = 'Eliminando...';
  confirmSubmitBtn.disabled = true;

  api.deleteCard(cardToDelete.id)
    .then(() => {
      if (cardToDelete.element && cardToDelete.element.remove) {
        cardToDelete.element.remove();
      }
      closeConfirmPopup();
    })
    .catch(err => console.log('Error al eliminar tarjeta:', err))
    .finally(() => {
      confirmSubmitBtn.textContent = defaultTxt;
      confirmSubmitBtn.disabled = false;
      confirmSubmitBtn.classList.remove('popup__save-button_disabled');
    });
});

confirmCloseBtn.addEventListener('click', closeConfirmPopup);


const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__save-button',
  inactiveButtonClass: 'popup__save-button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};


Array.from(document.querySelectorAll(validationConfig.formSelector)).forEach((form) => {
  const hasInputs = form.querySelectorAll(validationConfig.inputSelector).length > 0;
  if (!hasInputs) return;
  const formValidator = new FormValidator(validationConfig, form);
  formValidator.enableValidation();
});


document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('mousedown', (event) => {
    if (event.target === popup) popup.classList.remove('popup_opened');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_opened');
    if (openedPopup) openedPopup.classList.remove('popup_opened');
  }
});

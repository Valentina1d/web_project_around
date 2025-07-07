// 1. POPUP de editar perfil
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

// 2. ARRAY de tarjetas iniciales
const initialCards = [
  { name: "Valle de Yosemite", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/yosemite.jpg" },
  { name: "Lago Louise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lake-louise.jpg" },
  { name: "Montañas Calvas", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/bald-mountains.jpg" },
  { name: "Latemar", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/latemar.jpg" },
  { name: "Parque Nacional de la Vanoise", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/vanoise.jpg" },
  { name: "Lago di Braies", link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lago.jpg" }
];

// 3. Función para crear tarjeta sin innerHTML
function createCard(cardData) {
  const cardElement = document.createElement('article');
  cardElement.classList.add('card');

  const image = document.createElement('img');
  image.classList.add('card__image');
  image.src = cardData.link;
  image.alt = cardData.name;

  image.addEventListener('click', () => {
    openImagePopup(cardData.link, cardData.name);
  });

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('card__delete-button');
  deleteButton.type = 'button';

  const deleteIcon = document.createElement('img');
  deleteIcon.classList.add('card__delete-icon');
  deleteIcon.src = 'images/Trash.svg';
  deleteIcon.alt = 'Eliminar';

  deleteButton.append(deleteIcon);
  deleteButton.addEventListener('click', () => {
    cardElement.remove();
  });

  const description = document.createElement('div');
  description.classList.add('card__description');

  const title = document.createElement('h2');
  title.classList.add('card__title');
  title.textContent = cardData.name;

  const likeButton = document.createElement('button');
  likeButton.classList.add('card__like-button');
  likeButton.type = 'button';

  const likeIcon = document.createElement('img');
  likeIcon.classList.add('card__like-icon');
  likeIcon.src = 'images/Group.svg';
  likeIcon.alt = 'Me gusta';

  likeButton.append(likeIcon);

  likeIcon.addEventListener('click', () => {
    const currentSrc = likeIcon.getAttribute('src');
    if (currentSrc.includes('Group.svg')) {
      likeIcon.setAttribute('src', 'images/Union.png');
      likeIcon.setAttribute('alt', 'Me gusta activado');
    } else {
      likeIcon.setAttribute('src', 'images/Group.svg');
      likeIcon.setAttribute('alt', 'Me gusta');
    }
  });

  description.append(title, likeButton);
  cardElement.append(image, deleteButton, description);

  return cardElement;
}

// 4. Mostrar tarjetas al cargar
const galleryContainer = document.querySelector('.gallery');
initialCards.forEach((cardData) => {
  const card = createCard(cardData);
  galleryContainer.append(card);
});

// 5. Formulario para añadir nueva tarjeta
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
  const cardElement = createCard(newCard);
  galleryContainer.prepend(cardElement);
  addPopup.classList.remove('popup_opened');
});

// 6. Popup de imagen
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




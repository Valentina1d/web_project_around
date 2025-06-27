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
  {
    name: "Valle de Yosemite",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/yosemite.jpg"
  },
  {
    name: "Lago Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lake-louise.jpg"
  },
  {
    name: "Montañas Calvas",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/bald-mountains.jpg"
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/latemar.jpg"
  },
  {
    name: "Parque Nacional de la Vanoise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/vanoise.jpg"
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/new-markets/WEB_sprint_5/ES/lago.jpg"
  }
];

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const imageCloseButton = imagePopup.querySelector('.popup__close-button');

function openImagePopup(name, link) {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  imagePopup.classList.add('popup_opened');
}

imageCloseButton.addEventListener('click', () => {
  imagePopup.classList.remove('popup_opened');
});

const galleryContainer = document.querySelector('.gallery');

function createCard(cardData) {
  const cardElement = document.createElement('article');
  cardElement.classList.add('card');
  cardElement.innerHTML = `
    <img src="${cardData.link}" alt="${cardData.name}" class="card__image">
    <button class="card__delete-button" type="button">
      <img src="images/Trash.svg" alt="Eliminar" class="card__delete-icon" />
    </button>
    <div class="card__description">
      <h2 class="card__title">${cardData.name}</h2>
      <button class="card__like-button" type="button">
        <img src="images/Group.svg" alt="Me gusta" class="card__like-icon" />
      </button>
    </div>
  `;

  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', () => {
    cardElement.remove();
  });

  const likeIcon = cardElement.querySelector('.card__like-icon');
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

  const imageElement = cardElement.querySelector('.card__image');
  imageElement.addEventListener('click', () => {
    openImagePopup(cardData.name, cardData.link);
  });

  return cardElement;
}

initialCards.forEach((cardData) => {
  const card = createCard(cardData);
  galleryContainer.append(card);
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
  const cardElement = createCard(newCard);
  galleryContainer.prepend(cardElement);
  addPopup.classList.remove('popup_opened');
});



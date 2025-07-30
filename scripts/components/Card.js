export class Card {
  constructor(data, templateSelector) {
    this._name = data.name;
    this._link = data.link;
    this._templateSelector = templateSelector;
  }
 
  _getTemplate() {
    const template = document.querySelector(this._templateSelector).content;
    const cardElement = template.querySelector('.card').cloneNode(true);
    return cardElement;
  }
 
  _setEventListeners() {
    this._likeButton.addEventListener('click', () => {
      const currentSrc = this._likeIcon.getAttribute('src');
      if (currentSrc.includes('Group.svg')) {
        this._likeIcon.setAttribute('src', 'images/Union.png');
        this._likeIcon.setAttribute('alt', 'Me gusta activado');
      } else {
        this._likeIcon.setAttribute('src', 'images/Group.svg');
        this._likeIcon.setAttribute('alt', 'Me gusta');
      }
    });
 
    this._deleteButton.addEventListener('click', () => {
      this._element.remove();
    });
 
    this._image.addEventListener('click', () => {
      this._handleImageClick(this._link, this._name);
    });
  }
 
  _handleImageClick(link, name) {
    const popupImage = document.querySelector('.popup_type_image');
    const popupImg = popupImage.querySelector('.popup__image');
    const popupCaption = popupImage.querySelector('.popup__caption');
 
    popupImg.src = link;
    popupImg.alt = name;
    popupCaption.textContent = name;
 
    popupImage.classList.add('popup_opened');
  }
 
  generateCard() {
    this._element = this._getTemplate();
 
    this._image = this._element.querySelector('.card__image');
    this._title = this._element.querySelector('.card__title');
    this._likeButton = this._element.querySelector('.card__like-button');
    this._likeIcon = this._likeButton.querySelector('img');
    this._deleteButton = this._element.querySelector('.card__delete-button');
 
    this._image.src = this._link;
    this._image.alt = this._name;
    this._title.textContent = this._name;
 
    this._setEventListeners();
 
    return this._element;
  }
}
 
 
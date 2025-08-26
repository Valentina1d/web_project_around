export class Card {
  constructor(data, templateSelector, handleImageClick, handleLikeClick, handleDeleteClick, userId) {
    this._name = data.name;
    this._link = data.link;
    this._likes = data.likes || [];
    this._id = data._id;
    this._ownerId = data.owner._id;
    this._templateSelector = templateSelector;
    this._handleImageClick = handleImageClick;
    this._handleLikeClick = handleLikeClick;
    this._handleDeleteClick = handleDeleteClick;
    this._userId = userId;
  }

  _getTemplate() {
    const template = document.querySelector(this._templateSelector).content;
    return template.querySelector('.card').cloneNode(true);
  }

  _isLikedByUser() {
    return this._likes.some(like => like._id === this._userId);
  }

  _updateLikeState() {
    const isLiked = this._isLikedByUser();
    this._likeIcon.src = isLiked ? 'images/Union.png' : 'images/Group.svg';
    this._likeIcon.alt = isLiked ? 'Me gusta activado' : 'Me gusta';
  }

  _setEventListeners() {
    this._likeButton.addEventListener('click', () => {
      this._handleLikeClick(this);
    });

    this._deleteButton.addEventListener('click', () => {
      this._handleDeleteClick(this._id, this._element);
    });

    this._image.addEventListener('click', () => {
      this._handleImageClick(this._link, this._name);
    });
  }

  updateLikes(newLikes) {
    this._likes = newLikes;
    this._updateLikeState();
  }

  deleteCard() {
    this._element.remove();
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

    // Ocultar botón de eliminar si no es dueño
    console.log('ownerId:', this._ownerId, 'userId:', this._userId);
    if (this._ownerId !== this._userId) {
      this._deleteButton.style.visibility = 'hidden';
    }

    this._updateLikeState();
    this._setEventListeners();

    return this._element;
  }
}


 
 
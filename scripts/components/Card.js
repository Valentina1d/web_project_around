// scripts/components/Card.js
export class Card {
  constructor(data, templateSelector, handleImageClick, handleLikeClick, handleDeleteClick, userId) {
    this._name = data.name;
    this._link = data.link;
    this._likes = Array.isArray(data.likes) ? data.likes : [];
    this._id = data._id;
    this._ownerId = (data.owner && data.owner._id) || userId;

    this._templateSelector = templateSelector;
    this._handleImageClick = handleImageClick;
    this._handleLikeClick = handleLikeClick;
    this._handleDeleteClick = handleDeleteClick;
    this._userId = userId;
  }

  _getTemplate() {
    const template = document.querySelector(this._templateSelector);
    if (!template) throw new Error(`No encontré ${this._templateSelector}`);
    const node = template.content.querySelector('.card');
    if (!node) throw new Error('Dentro del template falta .card');
    return node.cloneNode(true);
  }

  _isLikedByUser() {
    return Array.isArray(this._likes) && this._likes.some(like => {
      const id = typeof like === 'string' ? like : like && like._id;
      return id === this._userId;
    });
  }

  updateLikes(newLikes) {
    this._likes = Array.isArray(newLikes) ? newLikes : [];
    this._updateLikeState();
  }

  _updateLikeState() {
    const isLiked = this._isLikedByUser();

    // contador
    if (this._likeCount) this._likeCount.textContent = this._likes.length;

    // clase activa (para CSS)
    if (this._likeButton) {
      this._likeButton.classList.toggle('card__like-button_active', isLiked);
    }

    // icono (cambia a negro con Union.png)
    if (this._likeIcon) {
      this._likeIcon.src = isLiked ? 'images/Union.png' : 'images/Group.svg';
      this._likeIcon.alt = isLiked ? 'Quitar me gusta' : 'Dar me gusta';
    }
  }

  _setEventListeners() {
    if (this._likeButton) {
      this._likeButton.addEventListener('click', () => this._handleLikeClick(this));
    }
    if (this._deleteButton) {
      this._deleteButton.addEventListener('click', () => this._handleDeleteClick(this._id, this._element));
    }
    this._image.addEventListener('click', () => this._handleImageClick(this._link, this._name));
  }

  deleteCard() {
    this._element.remove();
    this._element = null;
  }

  generateCard() {
    this._element = this._getTemplate();

    this._image = this._element.querySelector('.card__image');
    this._title = this._element.querySelector('.card__title');
    this._likeButton = this._element.querySelector('.card__like-button');
    this._likeIcon = this._likeButton ? this._likeButton.querySelector('img') : null;
    this._likeCount = this._element.querySelector('.card__like-count'); // <- contador
    this._deleteButton = this._element.querySelector('.card__delete-button');

    this._image.src = this._link;
    this._image.alt = this._name;
    this._title.textContent = this._name;

    // Ocultar caneca si no es tu tarjeta
    if (this._ownerId !== this._userId && this._deleteButton) {
      this._deleteButton.style.visibility = 'hidden';
      this._deleteButton.style.pointerEvents = 'none';
    }

    this._updateLikeState();
    this._setEventListeners();

    return this._element;
  }
}


 
 
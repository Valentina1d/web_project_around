import Popup from './Popup.js';

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = this._popup.querySelector('.popup__submit-button');
  }

  
  setSubmitAction(submitFunction) {
    this._handleSubmitCallback = submitFunction;
  }

  setEventListeners() {
    super.setEventListeners();
    
    this._form.addEventListener('click', (evt) => {
      evt.preventDefault();
      
      // Ejecutar la función de callback si existe
      if (this._handleSubmitCallback) {
        this._handleSubmitCallback();
      }
      
      this.close();
    });
  }
}
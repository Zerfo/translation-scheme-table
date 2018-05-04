import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import '../../style/modalWindows/modalWindow.css';

import languageOfTranslation from '../../languageOfTranslation';
import NameInput from '../items/NameInput';
import LangSelect from '../items/LangSelect';
import CommentTextarea from '../items/CommentTextarea';
import ShowItemMass from '../items/ShowItemMass';
import BtnClick from '../items/BtnClick';

export default class ModalWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validForm: {
        nameTask: true,
        originalLang: true,
        translateLang: {
          coincidenceLang: true,
          emptyField: true
        },
        comment: true
      },
      values: {
        massTranslateLang: [],
        nameTask: '',
        originalLang: '',
        comment: ''
      }
    };

    if(this.props.addOredit === "edit") {
      let taskStr = localStorage.getItem(this.props.keyLS);
      taskStr = JSON.parse(taskStr);
      this.state = {
        validForm: {
          nameTask: true,
          originalLang: true,
          translateLang: {
            coincidenceLang: true,
            emptyField: true
          },
          comment: true
        },
        values: {
          massTranslateLang: taskStr.translateLang,
          nameTask: taskStr.nameTask,
          originalLang: taskStr.originalLang,
          comment: taskStr.comment
        }
      }
    }
  }

  /**
   * Функция проверяет на валидность поля окна
   * @param {string} nameTask Название задачи
   * @param {string} originalLang Язык оригинала
   * @param {string} comment Комментарий к задаче
   * @returns {boolean} Если все поля валидны возвращает true, иначе false
   */
  isValid(nameTask, originalLang, comment) {
    let reg = new RegExp('[a-zA-Zа-яА-Я0-9]+');
    const flag = this.state.values.massTranslateLang.every((item) => originalLang !== item);
    /**
     * Определяем обект валидности полей, если какое-то из них не прошло проверку.
     * Изменяем state компонента для отрисовки ошибок.
     */
    if (reg.test(nameTask) && originalLang !== '' && this.state.values.massTranslateLang.length > 0 && reg.test(comment) && flag) {
      return true;
    } else {
      let isInvalid = {
        nameTask: true,
        originalLang: true,
        translateLang: {
          coincidenceLang: true,
          emptyField: true
        },
        comment: true
      };
      isInvalid.nameTask = reg.test(nameTask) ? true : false;
      isInvalid.originalLang = originalLang !== '' ? true : false;
      isInvalid.translateLang = {};
      isInvalid.translateLang.emptyField = this.state.values.massTranslateLang.length > 0 ? true : false;
      for (let key in this.state.massTranslateLang) {
        isInvalid.translateLang.coincidenceLang = originalLang !== this.state.values.massTranslateLang[key] ? true : false;
        if(isInvalid.translateLang.coincidenceLang === false){ break; }
      }
      isInvalid.comment = reg.test(comment) ? true : false;
      this.setState({validForm: isInvalid});
      return false;
    }
  }

  /**
   * Функция формирует объект задачи и записывает его с localStorage
   * @returns {boolean} Если поля прошли валидацию, перерисовывает родительский компонент и возвращает true
   */
  addTask = () => {
    let isValid = this.isValid(this.state.values.nameTask, this.state.values.originalLang, this.state.values.comment);
    if(isValid === true){
      let task = {
        id: localStorage.length + 1,
        nameTask: this.state.values.nameTask,
        originalLang: this.state.values.originalLang,
        translateLang: this.state.values.massTranslateLang,
        comment: this.state.values.comment
      };
      localStorage.setItem(task.id, JSON.stringify(task));
      this.props.onShow();
      this.props.onClose();
      return true;
    }

  };

  /**
   * Функция формирует измененный объект задачи и записывает его с localStorage
   * @returns {boolean} Если поля прошли валидацию, перерисовывает родительский компонент и возвращает true
   */
  editTask = () => {
    let isValid = this.isValid(this.state.values.nameTask, this.state.values.originalLang, this.state.values.comment);
    if(isValid === true){
      let task = {
        id: localStorage.length + 1,
        nameTask: this.state.values.nameTask,
        originalLang: this.state.values.originalLang,
        translateLang: this.state.values.massTranslateLang,
        comment: this.state.values.comment
      };
      localStorage.removeItem(this.props.keyLS);
      localStorage.setItem(this.props.keyLS, JSON.stringify(task));
      this.props.onShow();
      this.props.onClose();
      return true;
    }
  };

  /**
   * Функция добовляет в массив выбранных для перевода языков новый язык, если того там еще нет.
   * Перерисовывает модальное окно для отрисовки выбранного языка изменяя state
   * @param translateLang Выбранный в селекторе язык
   */
  addLang = (value) => {
    const flag = this.state.values.massTranslateLang.every(item => value !== item);

    if(flag) {
      let massTranslateLang = [value].concat(this.state.values.massTranslateLang);
      this.setState({
        values: {
          massTranslateLang: massTranslateLang,
          nameTask: this.state.values.nameTask,
          originalLang: this.state.values.originalLang,
          comment: this.state.values.comment
        }
      });
    }
  };

  /**
   * Функция удаляет из массива выбранных языков язык по которому произашел клик.
   * Перерисовывает модальное окно для отображения актуальных выбранных языков
   * @param item язык по которому произошел клик для его удаления
   */
  deleteLang = (item) => {
    let massTranslateLang = this.state.values.massTranslateLang.slice();
    for(let key in massTranslateLang){
      if(massTranslateLang[key] === item){
        massTranslateLang.splice(key, 1);
      }
    }
    this.setState({
      values: {
        massTranslateLang: massTranslateLang,
        nameTask: this.state.values.nameTask,
        originalLang: this.state.values.originalLang,
        comment: this.state.values.comment
      }
    });
  };

  /**
   * Функция получает value из поля "Название"
   * @param {string} value значение поля
   */
  getValueInput = (value) => {
    this.setState({
      values: {
        massTranslateLang: this.state.values.massTranslateLang,
        nameTask: value,
        originalLang: this.state.values.originalLang,
        comment: this.state.values.comment
      }
    })
  };

  /**
   * Функция получает value из поля "Язык оригинала"
   * @param {string} value значение поля
   */
  getValueSelect = (value) => {
    this.setState({
      values: {
        massTranslateLang: this.state.values.massTranslateLang,
        nameTask: this.state.values.nameTask,
        originalLang: value,
        comment: this.state.values.comment
      }
    })
  };

  /**
   * Функция получает value из поля "Комментарий"
   * @param {string} value значение поля
   */
  getValueComment = (value) => {
    this.setState({
      values: {
        massTranslateLang: this.state.values.massTranslateLang,
        nameTask: this.state.values.nameTask,
        originalLang: this.state.values.originalLang,
        comment: value
      }
    })
  };

  render() {
    return ReactDOM.createPortal(
      <div className = "modal-window-wrapper">
        <form className = "modal">
          <div className = "head">Добавить новую схему</div>
          <div className = "body">
            <NameInput
              getValue = { this.getValueInput }
              defaultValue = { this.state.values.nameTask }
            />
            { !this.state.validForm.nameTask && <p className = "err">Название обязательное поле!</p> }

            <LangSelect
              textType = "Выберите язык оригинала"
              getValue = { this.getValueSelect }
              mapLang = { languageOfTranslation }
              defaultValue = { this.state.values.originalLang }
            />
            { !this.state.validForm.originalLang && <p className = "err">Язык оригинала обязательное поле!</p> }

            <LangSelect
              textType = "Выберите язык перевода"
              getValue = { this.addLang }
              mapLang = { languageOfTranslation }
              defaultValue = { this.state.values.originalLang }
            />
            <ShowItemMass
              mass = { this.state.values.massTranslateLang }
              deleteLang = { (item) => this.deleteLang(item) }
            />
            { !this.state.validForm.translateLang.emptyField && <p className = "err">Язык перевода обязательное поле!</p>}
            { !this.state.validForm.translateLang.coincidenceLang && <p className = "err">Язык оригинала не должен совпадать с языком перевода!</p> }

            <CommentTextarea
              defaultValue = { this.state.values.comment }
              getValue = { this.getValueComment }
            />
            { !this.state.validForm.comment && <p className = "err">Комментарий обязательное поле!</p> }

            <div className = "btn">
              <BtnClick
                funcClick = { this.props.onClose }
                btnText = { "Отмена" }
              />
              { this.props.addOredit === 'add' ?
                  <BtnClick
                    funcClick = { () => this.addTask() }
                    btnText = { "Добавить" }
                  />
                :
                  <BtnClick
                    funcClick = { () => this.editTask() }
                    btnText = { "Редактировать" }
                  />
              }
            </div>
          </div>
        </form>
        <div className = "overlay" onClick = { this.props.onClose }/>
      </div>,
      document.getElementById('modal')
    );
  }
}
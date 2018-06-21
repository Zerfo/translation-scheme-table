import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'

import '../../style/modalWindows/modalWindow.css';

import * as Actions from '../../actions/Actions';
import store from '../../index';

import languageOfTranslation from '../../languageOfTranslation';
import NameInput from '../items/NameInput';
import LangSelect from '../items/LangSelect';
import CommentTextarea from '../items/CommentTextarea';
import ShowItemMass from '../items/ShowItemMass';
import BtnClick from '../items/BtnClick';

function mapStateToProps(state) {
  return {
    tasks: state.tasks
  }
}

class ModalWindow extends Component {
  constructor(props) {
    super(props);
    const keyLS = this.props.keyLS;
    let taskStr = JSON.parse(localStorage.getItem(keyLS.toString()));
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
    };
  }

  /**
   * Функция проверяет на валидность поля окна
   * @param {string} nameTask Название задачи
   * @param {string} originalLang Язык оригинала
   * @param {string} comment Комментарий к задаче
   * @returns {boolean} Если все поля валидны возвращает true, иначе false
   */
  isValid = (nameTask, originalLang, comment) => {
    let reg = new RegExp('[a-zA-Zа-яА-Я0-9]+');
    const flag = this.state.values.massTranslateLang.every((item) => originalLang !== item);
    /**
     * Определяем обект валидности полей, если какое-то из них не прошло проверку.
     * Изменяем state компонента для отрисовки ошибок.
     */
    if (reg.test(nameTask) && originalLang !== '' && this.state.values.massTranslateLang.length > 0 && reg.test(comment) && flag) {
      return true;
    } else {
      let isInvalid = {};
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
  };

  /**
   * Функция формирует объект задачи, записывает его с localStorage и store
   * @returns {boolean} Если поля прошли валидацию, перерисовывает родительский компонент и возвращает true
   */
  addTask = () => {
    let isValid = this.isValid(this.state.values.nameTask, this.state.values.originalLang, this.state.values.comment);
    if(isValid === true){
      let task = {
        id: localStorage.length,
        nameTask: this.state.values.nameTask,
        originalLang: this.state.values.originalLang,
        translateLang: this.state.values.massTranslateLang,
        comment: this.state.values.comment
      };
      localStorage.setItem(task.id, JSON.stringify(task));
      store.dispatch(Actions.addTask(task));
      this.props.onClose();
      return true;
    }
  };

  /**
   * @param key Ключ редактируемой задачи
   * @returns {boolean} Если поля прошли валидацию, перерисовывает родительский компонент и возвращает true
   */
  editTask = (key) => {
    let isValid = this.isValid(this.state.values.nameTask, this.state.values.originalLang, this.state.values.comment);
    if(isValid === true){
      let task = {
        id: key,
        nameTask: this.state.values.nameTask,
        originalLang: this.state.values.originalLang,
        translateLang: this.state.values.massTranslateLang,
        comment: this.state.values.comment
      };
      localStorage.removeItem(key);
      localStorage.setItem(key, JSON.stringify(task));
      store.dispatch(Actions.editTask());
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
      let massTranslateLang = this.state.values.massTranslateLang.concat(value);
      this.setState({
        values: { ...this.state.values, massTranslateLang: massTranslateLang }
      });
    }
  };

  /**
   * Функция удаляет из массива выбранных языков язык по которому произашел клик.
   * Перерисовывает модальное окно для отображения актуальных выбранных языков
   * @param item язык по которому произошел клик для его удаления
   */
  deleteLang = (item) => {//переписать с методом filter();
    let massTranslateLang = this.state.values.massTranslateLang.slice();
    for(let key in massTranslateLang){
      if(massTranslateLang[key] === item){
        massTranslateLang.splice(key, 1);
      }
    }
    this.setState({
      values: { ...this.state.values, massTranslateLang: massTranslateLang }
    });
  };

  /**
   * Функция получает value из поля "Название"
   * @param {string} value значение поля
   */
  getValueInput = (value) => {
    this.setState({
      values: { ...this.state.values, nameTask: value }
    });
  };

  /**
   * Функция получает value из поля "Язык оригинала"
   * @param {string} value значение поля
   */
  getValueSelect = (value) => {
    this.setState({
      values: { ...this.state.values, originalLang: value }
    });
  };

  /**
   * Функция получает value из поля "Комментарий"
   * @param {string} value значение поля
   */
  getValueComment = (value) => {
    this.setState({
      values: { ...this.state.values, comment: value, }
    });
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
              defaultValue = { this.state.values.massTranslateLang[0] }
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
              { this.props.addOrEdit === 'add' ?
                  <BtnClick
                    funcClick = { () => this.addTask() }
                    btnText = { "Добавить" }
                  />
                :
                  <BtnClick
                    funcClick = { () => this.editTask(this.props.keyLS) }
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

export default connect(mapStateToProps)(ModalWindow)
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import NameTaskInput from './NameTaskInput';
import OriginalLangSelect from './OriginalLangSelect';
import CommentTextArea from './CommentTextArea'

export default class ModalWindow extends Component {
  nameTask = "";
  originalLang = "";
  translateLang = [];
  comment = "";
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
      massTranslateLang: [],
      values: {
        nameTask: '',
        originalLang: '',
        comment: ''
      }
    };

    if(this.props.add === "Редактировать"){
      let taskStr = localStorage.getItem(this.props.keyLS);
      taskStr = JSON.parse(taskStr);
      this.nameTask = taskStr.nameTask;
      this.originalLang = taskStr.originalLang;
      this.comment = taskStr.comment;
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
        massTranslateLang: taskStr.translateLang,
        values: {
          nameTask: taskStr.nameTask,
          originalLang: taskStr.originalLang,
          comment: taskStr.comment
        }
      };
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
    const flag = this.state.massTranslateLang.every((item) => originalLang !== item);
    /**
     * Определяем обект валидности полей, если какое-то из них не прошло проверку.
     * Изменяем state компонента для отрисовки ошибок.
     */
    if (reg.test(nameTask) && originalLang !== '' && this.state.massTranslateLang.length > 0 && reg.test(comment) && flag) {
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
      isInvalid.translateLang.emptyField = this.state.massTranslateLang.length > 0 ? true : false;
      for (let key in this.state.massTranslateLang) {
        isInvalid.translateLang.coincidenceLang = originalLang !== this.state.massTranslateLang[key] ? true : false;
        if(isInvalid.translateLang.coincidenceLang === false){ break; }
      }
      isInvalid.comment = reg.test(comment) ? true : false;
      setTimeout(this.setState({validForm: isInvalid}),500);
      return false;
    }
  }

  /**
   * Функция формирует объект задачи и записывает его с localStorage
   * @returns {boolean} Если поля прошли валидацию, перерисовывает родительский компонент и возвращает true
   */
  addTask(){
    const nameTask = this.state.values.nameTask;
    const originalLang = this.state.values.originalLang;
    const comment = this.state.values.comment;

    let isValid = this.isValid(nameTask, originalLang, comment);
    if(isValid === true){
      let task = {
        id: localStorage.length + 1,
        nameTask: nameTask,
        originalLang: originalLang,
        translateLang: this.state.massTranslateLang,
        comment: comment
      };
      localStorage.setItem(task.id, JSON.stringify(task));
      this.props.onShow();
      return true;
    }else{
      this.render();
    }
  }

  /**
   * Функция формирует измененный объект задачи и записывает его с localStorage
   * @returns {boolean} Если поля прошли валидацию, перерисовывает родительский компонент и возвращает true
   */
  editTask(){
    const nameTask = this.state.values.nameTask;
    const originalLang = this.state.values.originalLang;
    const comment = this.state.values.comment;

    let isValid = this.isValid(nameTask, originalLang, comment);

    if(isValid === true){
      const task = {
        id: this.props.key,
        nameTask: nameTask,
        originalLang: originalLang,
        translateLang: this.state.massTranslateLang,
        comment: comment
      };
      localStorage.removeItem(this.props.keyLS);
      localStorage.setItem(this.props.keyLS, JSON.stringify(task));
      this.props.onShow();
      return true;
    }else{
      this.render();
    }
  }

  /**
   * Функция добовляет в массив выбранных для перевода языков новый язык, если того там еще нет.
   * Перерисовывает модальное окно для отрисовки выбранного языка изменяя state
   * @param translateLang Выбранный в селекторе язык
   */
  addLang(translateLang){
    const flag = this.state.massTranslateLang.every((item) => translateLang !== item);

    if(flag){
      let MassTranslateLang = [];
      MassTranslateLang.push(translateLang);
      let newMassTranslateLang = MassTranslateLang.concat(this.state.massTranslateLang);
      setTimeout(()=>{document.getElementById('translateLang').value = "";},300);
      this.setState({
        massTranslateLang: newMassTranslateLang
      });
    }
  }
  /**
   * Функция удаляет из массива выбранных языков язык по которому произашел клик.
   * Перерисовывает модальное окно для отображения актуальных выбранных языков
   * @param item язык по которому произошел клик для его удаления
   */
  deleteLang(item){
    let massTranslateLang = this.state.massTranslateLang.slice();
    for(let key in massTranslateLang){
      if(massTranslateLang[key] === item){
        massTranslateLang.splice(key, 1);
      }
    }
    this.setState({
      massTranslateLang: massTranslateLang
    });
  }

  /**
   * Функция получает value из поля "Название"
   * @param {string} value значение поля
   */
  getValueInput = (value) => {
    this.setState({
      values: {
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
        nameTask: this.state.values.nameTask,
        originalLang: this.state.values.originalLang,
        comment: value
      }
    })
  };

  render() {
    return ReactDOM.createPortal(
      <div className="modal-window-wrapper">

        <form className="modal">
          <div className="head">Добавить новую схему</div>
          <div className="body">
            <NameTaskInput getValue={this.getValueInput} defaultValue={this.nameTask} />
            { !this.state.validForm.nameTask ? <p className="err">Название обязательное поле!</p> : '' }

            <OriginalLangSelect mapLang={this.props.mapLang} getValue={this.getValueSelect} defaultValue={this.originalLang}/>
            { !this.state.validForm.originalLang ? <p className="err">Язык оригинала обязательное поле!</p> : '' }

            <select defaultValue={this.translateLang} ref={(select) => this.select = select} name="translateLang" id="translateLang" onChange={()=>{this.addLang(document.getElementById('translateLang').value)}}>
              <option value="" disabled selected>Выберите язык перевода</option>
              { this.props.mapLang.map(item => {
                  return <option key={item.id} value={item.id}>{item.name}</option>
                })
              }
            </select>

            <div className="selectLang">
              {
                this.state.massTranslateLang.map(item => {
                  return <div key={item.id} className="lang" onClick={ () => {this.deleteLang(item)}}>{item}</div>
                })
              }
            </div>

            { !this.state.validForm.translateLang.emptyField ? <p className="err">Язык перевода обязательное поле!</p> : ''}
            { !this.state.validForm.translateLang.coincidenceLang ? <p className="err">Язык оригинала не должен совпадать с языком перевода!</p> : '' }

            <CommentTextArea getValue={this.getValueComment} defaultValue={this.comment} />
            { !this.state.validForm.comment ? <p className="err">Комментарий обязательное поле!</p> : '' }

            <div className="btn">
              <div className="btnAdd" onClick={this.props.onClose}>Отмена</div>
              <div className="btnAdd" onClick={() => { if(this.props.add === "Добавить" ? this.addTask() : this.editTask()){ this.props.onClose();} }}>{this.props.add}</div>
            </div>

          </div>
        </form>

        <div className="overlay" onClick={this.props.onClose}/>
      </div>,
      document.getElementById('modal')
    );
  }
}
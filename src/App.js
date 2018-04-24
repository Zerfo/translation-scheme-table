import React, { Component } from 'react';

import ModalWindow from './component/modalWindow';

class App extends Component {
  mapLang = [
    {
      id: "en",
      name: "Английский"
    },
    {
      id: "ru",
      name: "Русский"
    },
    {
      id: "fr",
      name: "Французкий"
    },
    {
      id: "de",
      name: "Немецкий"
    },
    {
      id: "pl",
      name: "Польский"
    },
    {
      id: "sp",
      name: "Испанский"
    }
  ]; //массив объектов доступных для перевода языков
  addOrEdit = "";//переменная по которой определяем какого рода модальное окно показывть, добавления задачи или редактирования.
  massTask = [];//массив уже существующих задач в localStorage. Заполняется в методе showTask
  key = 0;//ключ который передаем в качестве пораметра в модальное окно. Если 0 то мы добавляем задачу, а не редактируем существующую
  constructor(props) {
    super(props);
    this.showTask();
    this.state = {
      isModalOpen: false,
      massTask: this.massTask
    };

  }

  /**
   * Функция формирует массив существующих задач если localStorage не пустой.
   * И изменяет состояние компонента, для отрисовки существующих задач
   */
  showTask(){
    if(localStorage.length > 0) {
      this.massTask = [];
      for(let i = 1; i <= localStorage.length; i++) {
        let taskStr = localStorage.getItem(`${i}`);
        taskStr = JSON.parse(taskStr);
        this.massTask.push({id: i, nameTask: taskStr.nameTask, originalLang: taskStr.originalLang, translateLang: taskStr.translateLang, comment: taskStr.comment});
      }
      this.setState({
        massTask: this.massTask
      })
    }
  }

  /**
   * Функция вызывает модальное окно в React Portal
   * @param {string} addOrEdit Определяет будем мы добавлять новую задачу или редактировать существующую
   * @param {int} key Значение ключа задачи по которой произошел клик
   */
  showModalAddWindow(addOrEdit, key){
      this.setState({isModalOpen: !this.state.isModalOpen});
      this.addOrEdit = addOrEdit;
      this.key = key;
  }

  render() {
    return (
      <div className="container">
        <div className="btnAdd" onClick={() => this.showModalAddWindow("add")}>Добавить</div>
        <div className="table">
          <table>
            <tr>
              <th>Название</th>
              <th>Язык оригинала</th>
              <th>Языки перевода</th>
              <th>Комментарий</th>
            </tr>
            { localStorage.length > 0 ? this.state.massTask.map(item => { //Если localStorage не пустой, то отрисовываем на экране имеющиеся задачи
              return <tr><td>{item.nameTask}<div className="pencil" onClick={ () => this.showModalAddWindow("edit", item.id)}></div></td><td>{item.originalLang}</td><td>{item.translateLang.join(", ")}</td><td>{item.comment}</td></tr>
            }) : '' }
          </table>
          { //Если localStorage  пустой, выводим сообщение с дополнительной кнопкой добавить задачу
            localStorage.length == 0 ? <div className="infoNoneTask">Нет ни одной схемы, <a className="noneTask" onClick={() => this.showModalAddWindow("add")}> добавить</a></div> : ''
          }
        </div>
        { this.state.isModalOpen ? <ModalWindow mapLang={this.mapLang} keyLS={this.key} add={this.addOrEdit === "add" ? "Добавить" : "Редактировать"} onShow={() => this.showTask()} onClose={() => this.showModalAddWindow()}/> : '' }
      </div>
    );
  }
}

export default App;

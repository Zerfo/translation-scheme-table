import React, { Component } from 'react';

import './style/app.css';

import ModalWindow from './component/modalWindows/ModalWindow';
import BtnClick from './component/items/BtnClick';

export default class App extends Component {
  defineTask = { addOrEdit: 'add', key: 0 };
  constructor(props){
    super(props);

    this.state = {
      isModalOpen: false,
      massTask: this.showTask()
    };
  }

  /**
   * Функция возвращает массив существующих задач если localStorage не пустой.
   */
  showTask(){
    if(localStorage.length > 0){
      let massTask = [];
      for(let key = 1; key <= localStorage.length; key++) {
        let taskStr = localStorage.getItem(`${key}`);
        taskStr = JSON.parse(taskStr);
        massTask.push({
          id: key,
          nameTask: taskStr.nameTask,
          originalLang: taskStr.originalLang,
          translateLang: taskStr.translateLang,
          comment: taskStr.comment
        });
      }
      this.setState({
        massTask: massTask
      });
      return massTask;
    }
  }

  /**
   * Функция вызывает модальное окно в React Portal
   */
  showModalWindow = (addOrEdit = "add", key = 0) => {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
    this.defineTask = {addOrEdit: addOrEdit, key: key}
  };

  render() {
    return (
      <div className="container">
        <BtnClick
          funcClick = { () => this.showModalWindow("add", 0) }
          btnText = { "Добавить" }
        />
        <div className="table">
          <table>
            <tbody>
              <tr>
                <th>Название</th>
                <th>Язык оригинала</th>
                <th>Языки перевода</th>
                <th>Комментарий</th>
              </tr>
              { localStorage.length > 0 && this.state.massTask.map(item => { //Если localStorage не пустой, то отрисовываем на экране имеющиеся задачи
                  return(
                    <tr key = { item.id }>
                      <td>{ item.nameTask }<div className="pencil" onClick={() => {
                              this.showModalWindow("edit", item.id);
                            }
                          }
                      /></td>
                      <td>{ item.originalLang }</td>
                      <td>{ item.translateLang.join(", ") }</td>
                      <td>{ item.comment }</td>
                    </tr>
                  )
                }) }
            </tbody>
          </table>
          { //Если localStorage  пустой, выводим сообщение с дополнительной кнопкой добавить задачу
            localStorage.length === 0 && <div className="infoNoneTask">Нет ни одной схемы,<a className="noneTask" onClick={() => this.showModalWindow()}>добавить</a></div>
          }
        </div>
        { this.state.isModalOpen && <ModalWindow
          addOredit = { this.defineTask.addOrEdit }
          keyLS = { this.defineTask.key }
          onShow = { () => this.showTask() }
          onClose = { () => this.showModalWindow() }
          />
        }
      </div>
    );
  }
}

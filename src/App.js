import React, { Component } from 'react';
import { connect } from 'react-redux'

import './style/app.css';

import ModalWindow from './component/modalWindows/ModalWindow';
import BtnClick from './component/items/BtnClick';

function mapStateToProps(state) {
  return {
    tasks: state.tasks
  }
}

class App extends Component {
  defineTask = { addOrEdit: 'add', key: 0 };

  constructor(props){
    super(props);
    this.state = {
      isModalOpen: false
    };
  }

  /**
   * Функция вызывает модальное окно в React Portal
   */
  showModalWindow = (addOrEdit = "add", key = 0) => {
    this.defineTask = {addOrEdit: addOrEdit, key: key.toString()};
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  };

  render() {
    return (
      <div className="container">
        <BtnClick
          funcClick = { () => this.showModalWindow() }
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
            { this.props.tasks.length > 0 && this.props.tasks.map(item => { //Если localStorage не пустой, то отрисовываем на экране имеющиеся задачи
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
            this.props.tasks.length === 0 && <div className="infoNoneTask">Нет ни одной схемы,<a className="noneTask" onClick={() => this.showModalWindow()}>добавить</a></div>
          }
        </div>
        {
          this.state.isModalOpen && <ModalWindow
            addOrEdit = { this.defineTask.addOrEdit }
            keyLS = { this.defineTask.key }
            onClose = { () => this.showModalWindow() }
          />
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
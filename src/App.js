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
  ];
  addOrEdit = "";
  massTask = [];
  key = 0;
  constructor(props) {
    super(props);
    this.showTask();
    this.state = {
      isModalOpen: false,
      massTask: this.massTask
    };

  }

  showTask(){
    if(localStorage.getItem('1') !== null) {
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
            { localStorage.length > 0 ? this.state.massTask.map(item => {
                return <tr><td onClick={ () => this.showModalAddWindow("edit", item.id)}>{item.nameTask}</td><td>{item.originalLang}</td><td>{item.translateLang.join(", ")}</td><td>{item.comment}</td></tr>
            }) : '' }
          </table>
          { localStorage.getItem('1') === null ? <div className="infoNoneTask">Нет ни одной схемы, <a className="noneTask" onClick={() => this.showModalAddWindow("add")}> добавить</a></div> : '' }
        </div>
        { this.state.isModalOpen ? <ModalWindow mapLang={this.mapLang} keyLS={this.key} add={this.addOrEdit === "add" ? "Добавить" : "Сохранить"} onShow={() => this.showTask()} onClose={() => this.showModalAddWindow()}/> : '' }
      </div>
    );
  }
}

export default App;

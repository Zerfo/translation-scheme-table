/**
 * Функция формирует изначальный стор и кладет в localStorage шаблон пустой задачи
 * @returns {Array} массив всех задач хронащихся в localStorage
 */
const Tasks = () => {
  let defaultTask = {
    id: 0,
    nameTask: '',
    originalLang: '',
    translateLang: [],
    comment: ''
  };
  localStorage.setItem(defaultTask.id.toString(), JSON.stringify(defaultTask));

  if(localStorage.length > 0) {
    let massTask = [];
    for(let key = 1; key < localStorage.length; key++) {
      let taskStr = JSON.parse(localStorage.getItem(key.toString()));
      massTask.push(taskStr);
    }
    return massTask;
  }
};

const defaultSate = {
  tasks: Tasks()
};

/**
 * @param state стейт приложения
 * @param action действие определяющие изменение стейта
 * @returns {{tasks: Array}} новый массив задач, новый стейт приложения
 */
export default function taskState(state = defaultSate, action) {
  switch (action.type) {
    case 'addTask':
      return {...state, tasks: state.tasks.concat(action.payload)};
    case 'editTask':
      return {...state, tasks: Tasks()};
    default:
      return state
  }
}

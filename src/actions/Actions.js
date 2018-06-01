export function addTask(task) {
  return {
    type: 'addTask',
    payload: task
  }
}

export function editTask(task) {
  return {
    type: 'editTask',
    payload: task
  }
}
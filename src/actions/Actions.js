export function addTask(task) {
  return {
    type: 'addTask',
    payload: task
  }
}

export function editTask() {
  return {
    type: 'editTask'
  }
}
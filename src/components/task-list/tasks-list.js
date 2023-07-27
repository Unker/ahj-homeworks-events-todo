import './tasks-list.css';
import Task from '../../js/Task';

import { filterBy, containsText } from '../filter';

const testTasks = [
  'Подготовить презентацию для клиента',
  'Отправить документы на подпись',
  'Провести собрание команды проекта',
  'Изучить новый инструмент для управления задачами',
  'Подготовить отчет о выполненных задачах за прошлую неделю',
];

const filterCb = (search, task) => containsText(`${task.first_name} ${task.last_name}`, search);

export default class TasksList {
  constructor(taskTracker) {
    if (typeof taskTracker === 'string') {
      this._taskTracker = document.querySelector(taskTracker);
      this._listTasks = this._taskTracker.querySelector('.all-tasks');
      this._taskInput = this._taskTracker.querySelector('.task-input');
      this._taskForm = this._taskTracker.querySelector('.task-form');
    } else {
      throw new Error('Некорректный селектор', taskTracker);
    }

    this.filter = this.filter.bind(this);
    this.onTaskSubmit = this.onTaskSubmit.bind(this);
    this.onTaskInput = this.onTaskInput.bind(this);
    this.onClick = this.onClick.bind(this);

    this._tasks = [];

    for (const task of testTasks) {
      this._tasks.push(new Task(task));
    }

    const tasks = []; // Array to store all tasks

    this._taskInput.addEventListener('keydown', this.onTaskInput);
    this._taskForm.addEventListener('submit', this.onTaskSubmit);
    this._taskTracker.addEventListener('click', this.onClick);
  }

  static renderItem(task) {
    return `
      <li class="task-list-item">
        <div class="task-item-main" id=${task.id}>
          <span class="task-item-name">${task.name}</span>
          <input type="checkbox" class="task__checker" ${task.pinned ? 'checked' : ''} />

        </div>
      </li>`;
  }

  _clear() {
    const items = this._listTasks.querySelectorAll('.task-list-item');

    for (const child of items) {
      child.remove();
    }
  }

  _renderItems(items) {
    console.log('items:', items);
    this._clear();

    items.forEach((task) => {
      const itemHtml = TasksList.renderItem(task);

      this._listTasks.insertAdjacentHTML('beforeend', itemHtml);
    });
  }

  renderTasks() {
    this._renderItems(this._tasks);
  }

  filter(text) {
    const filterCallback = filterCb.bind(null, text);

    this._renderItems(filterBy(this._tasks, filterCallback));
  }

  // eslint-disable-next-line class-methods-use-this
  onTaskSubmit(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    // для вывода сообщения при пустом поле
  }

  onTaskInput(e) {
    if (e.key === 'Enter') {
      console.log('enter');
      const taskName = this._taskInput.value.trim();

      if (taskName.length === 0) {
        console.log('bad string');
        return;
      }

      const newTask = new Task(taskName);
      this._tasks.push(newTask);

      // Clear input field and re-render tasks
      this._taskInput.value = '';
      this.renderTasks();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onClick(e) {
    const { target } = e;
    console.log('click', e.target);
    if (target.classList.contains('task__checker')) {
      // наступили на pin
      const listItem = target.closest('.task-item-main');
      const idItem = listItem.id;
      // this._listTasks;
    }
  }
}

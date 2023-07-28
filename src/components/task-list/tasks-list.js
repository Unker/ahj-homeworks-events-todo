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

const filterCb = (search, [id, task]) => {
  if (task.pinned) {
    return false;
  }
  return containsText(`${task.name}`, search);
};

export default class TasksList {
  constructor(taskTracker) {
    if (typeof taskTracker === 'string') {
      this._taskTracker = document.querySelector(taskTracker);
      this._listTasks = this._taskTracker.querySelector('.allTasksList');
      this._pinnedTasks = this._taskTracker.querySelector('.pinnedTasksList');
      this._taskInput = this._taskTracker.querySelector('.task-input');
      this._taskForm = this._taskTracker.querySelector('.task-form');
      this._notFoundMessage = this._taskTracker.querySelector('.notFoundMessage');
      this._pinnedMessage = this._taskTracker.querySelector('.pinnedMessage');
    } else {
      throw new Error('Некорректный селектор', taskTracker);
    }

    this.filter = this.filter.bind(this);
    this.onTaskSubmit = this.onTaskSubmit.bind(this);
    this.onTaskInput = this.onTaskInput.bind(this);
    this.onClick = this.onClick.bind(this);

    this._tasksMap = new Map([]);

    for (const task of testTasks) {
      const id = Math.floor(Math.random() * 1e10).toString();
      this._tasksMap.set(id, new Task(task));
    }

    this._taskForm.addEventListener('submit', this.onTaskSubmit);
    this._taskInput.addEventListener('keydown', this.onTaskInput);
    this._taskTracker.addEventListener('click', this.onClick);
  }

  static renderItem(key, task) {
    return `
      <li class="task-list-item">
        <div class="task-item-main" id=${key}>
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

    const itemsPinned = this._pinnedTasks.querySelectorAll('.task-list-item');
    for (const child of itemsPinned) {
      child.remove();
    }
  }

  _renderItems(filteredItems) {
    this._clear();

    // render pinned
    this._tasksMap.forEach((task, key) => {
      const itemHtml = TasksList.renderItem(key, task);
      if (task.pinned) {
        this._pinnedTasks.insertAdjacentHTML('beforeend', itemHtml);
      }
    });

    // render filtered
    filteredItems.forEach((task, key) => {
      const itemHtml = TasksList.renderItem(key, task);
      if (!task.pinned) {
        this._listTasks.insertAdjacentHTML('beforeend', itemHtml);
      }
    });

    const items = this._listTasks.querySelector('.task-list-item');
    if (items) {
      this._notFoundMessage.style.display = 'none';
    } else {
      this._notFoundMessage.style.display = 'flex';
    }

    const itemsPinned = this._pinnedTasks.querySelector('.task-list-item');
    if (itemsPinned) {
      this._pinnedMessage.style.display = 'none';
    } else {
      this._pinnedMessage.style.display = 'flex';
    }
  }

  renderTasks() {
    this._renderItems(this._tasksMap);
  }

  filter(text) {
    const filterCallback = filterCb.bind(null, text);

    this._renderItems(filterBy(this._tasksMap, filterCallback));
  }

  // eslint-disable-next-line class-methods-use-this
  onTaskSubmit(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    // для вывода сообщения при пустом поле
  }

  onTaskInput(e) {
    if (e.key === 'Enter') {
      const taskName = this._taskInput.value.trim();

      if (taskName.length === 0) {
        return;
      }

      const id = Math.floor(Math.random() * 1e10).toString();
      this._tasksMap.set(id, new Task(taskName));

      e.stopImmediatePropagation();

      // Clear input field and re-render tasks
      this._taskInput.value = '';
      this.renderTasks();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onClick(e) {
    const { target } = e;
    if (target.classList.contains('task__checker')) {
      // наступили на pin
      const listItem = target.closest('.task-item-main');
      const idItem = listItem.id;
      this._tasksMap.get(idItem).pinned = target.checked;
      this.renderTasks();
    }
  }
}

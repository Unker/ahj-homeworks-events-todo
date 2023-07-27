import TasksList from '../components/task-list/tasks-list';
import FilterWidget from '../components/filter-widget/filter-widget';

const tasksList = new TasksList('.task-tracker');
const filterWidget = new FilterWidget('.filter-widget', tasksList.filter);

tasksList.renderTasks();

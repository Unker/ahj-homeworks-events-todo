export default class FilterWidget {
  constructor(el, filterHandler) {
    if (typeof el === 'string') {
      this._element = document.querySelector(el);
    }

    this._filterText = document.querySelector('.task-input');

    this._filterHandler = filterHandler;
    this.onFilter = this.onFilter.bind(this);

    this._filterText.addEventListener('input', this.onFilter);
  }

  onFilter(e) {
    e.preventDefault();

    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    const text = this._filterText.value;

    this._timeout = setTimeout(() => this._filterHandler(text), 300);
  }
}

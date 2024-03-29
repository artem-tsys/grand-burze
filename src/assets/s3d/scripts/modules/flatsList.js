import $ from 'jquery';
import {
  has,
  debounce,
} from 'lodash';
import paginationScroll from './pagination';
import sortArray from './sort';

class FlatsList {
  constructor(config, filter) {
    // this.subject = config.subject;
    this.hoverData$ = config.hoverData$;
    this.currentFilteredFlatIds$ = config.currentFilteredFlatIds$;
    // this.updateCurrentFilterFlatsId = config.updateCurrentFilterFlatsId;
    this.getFlat = config.getFlat;
    this.checkNextFlyby = config.checkNextFlyby;
    this.changePopupFlyby = config.changePopupFlyby;
    this.currentShowAmount = 0;
    this.showFlatList = [];
    // this.wrapperNode = document.querySelector('.js-s3d-filter__table');
    this.updateFsm = config.updateFsm;
    // this.filterHide = false;
    // this.nameSort = undefined;
    this.directionSortUp = true;
    this.filter = filter;
    this.favouritesIds$ = config.favouritesIds$;
    this.init();
  }

  init() {
    const filterContainer = document.querySelector('.js-s3d-filter');
    const tableContainer = document.querySelector('.js-s3d-filter__table');
    const bodyContainer = document.querySelector('.js-s3d-filter__body');

    this.currentFilteredFlatIds$.subscribe(value => {
      tableContainer.scrollTop = 0;
      bodyContainer.textContent = '';
      this.currentShowAmount = 0;
      this.updateShowFlat(value);
      this.createListFlat(value, bodyContainer, 30);
    });

    this.hoverData$.subscribe(data => {
      const { id } = data;
      if (!id) return;
      this.setActiveFlat(id);
    });

    tableContainer.addEventListener('scroll', debounce(event => {
      if (this.filter.isListScrollBlocked) return;
      this.filter.reduceFilter(event.target.scrollTop > 50);
      paginationScroll(event.target, this.showFlatList, this.currentShowAmount, this.createListFlat.bind(this));
    }, 150, {
      leading: true,
      trailing: true,
    }));

    $('.js-s3d-filter__mini-info__button').on('click', event => {
      this.filter.reduceFilter(false);
    });

    $('.js-s3d-filter__body').on('click', '.s3d-filter__tr', event => {
      const id = +event.currentTarget.dataset.id;
      if (
        $(event.originalEvent.target).hasClass('js-s3d-add__favourite')
        || event.originalEvent.target.nodeName === 'INPUT') {
        return;
      }

      const config = this.checkNextFlyby({ type: 'flyby' }, id);
      if (config === null) {
        return null;
      }
      if (config.change) {
        this.changePopupFlyby(config, event.currentTarget);
        return;
      }

      if (window.innerWidth <= 992) {
        this.filter.emit('hideFilter');
      }
      this.updateFsm({ ...config, id });
    });

    $('.js-s3d-filter__head').on('click', '.s3d-filter__th', e => {
      const nameSort = (e.currentTarget && e.currentTarget.dataset && has(e.currentTarget.dataset, 'sort')) ? e.currentTarget.dataset.sort : undefined;

      if (nameSort === undefined || (nameSort && nameSort === 'none')) {
        return;
      }
      if (e.currentTarget.classList.contains('s3d-sort-active')) {
        this.directionSortUp = !this.directionSortUp;
      } else {
        this.directionSortUp = true;
      }
      $('.s3d-sort-active').removeClass('s3d-sort-active');
      if (this.directionSortUp) {
        $(e.currentTarget).addClass('s3d-sort-active');
      }

      this.currentFilteredFlatIds$.next(sortArray(this.showFlatList, nameSort, this.getFlat, this.directionSortUp));
    });
  }

  setActiveFlat(id) {
    $('.js-s3d-filter__body .polygon__flat-svg').removeClass('polygon__flat-svg');
    $(`.js-s3d-filter__body [data-id=${id}]`).addClass('polygon__flat-svg');
  }

  updateShowFlat(list) {
    this.showFlatList = list;
  }

  createListFlat(flats, wrap, amount) {
    const favourites = this.favouritesIds$.value;
    const arr = flats.reduce((previous, current, index) => {
      if (index >= this.currentShowAmount && index < (this.currentShowAmount + amount)) {
        previous.push(this.createElem(this.getFlat(+current), favourites));
      }
      return previous;
    }, []);

    this.currentShowAmount += amount;
    document.querySelector('.js-s3d-filter__body').append(...arr);

    const { id } = this.hoverData$.value;
    if (!id) return;
    this.setActiveFlat(id);
  }

  createElem(flat, favourites) {
    const checked = favourites.includes(+flat.id) ? 'checked' : '';
    const tr = document.createElement('tr');
    tr.dataset.id = flat.id;
    tr.classList = 's3d-filter__tr js-s3d-filter__tr';
    tr.innerHTML = `
          <td class="s3d-filter__th--offset"></td>
					<td class="s3d-filter__td">${flat.type || '-'}</td>
					<td class="s3d-filter__td">${flat.rooms}</td>
					<td class="s3d-filter__td">${flat.floor}</td>
					<td class="s3d-filter__td">${flat.area} m<sup>2</sup></td>
					<td class="s3d-filter__td">
						<label data-id="${flat.id}" class="s3d__favourite s3d-filter__favourite js-s3d-add__favourite">
							<input type="checkbox" ${checked}>
							<svg role="presentation"><use xlink:href="#icon-favourites"></use></svg>
						</label>
					</td>
					<td class="s3d-filter__th--offset"></td>
			`;
    return tr;
  }
}

export default FlatsList;

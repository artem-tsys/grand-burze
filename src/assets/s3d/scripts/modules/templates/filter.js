function Filter(i18n) {
  return `
  <div class="s3d-filter-wrap js-s3d-filter">
    <div class="s3d-filter__close-wrap js-s3d-filter__close">
      <div class="s3d-filter__close"><span></span><span></span></div>
    </div>
    <div class="s3d-filter__top">
      <div class="s3d-filter__title"><span>${i18n.t('Filter.title')}</span></div>
      <div class="s3d-filter">
        <div class="s3d-filter__row">
          <div class="s3d-filter__row__title">${i18n.t('floor')}</div>
          <div class="s3d-filter__row__list js-filter-range">
            <!--label з-->
            <!--    input.js-s3d-filter__floor__min--input(type="number" data-type="floor"  data-border="min")-->
            <input class="js-s3d-filter__floor--input" data-type="floor" data-min="1" data-max="15" data-from="1" data-to="15">
            <!--label по-->
            <!--    input.js-s3d-filter__floor__max--input(type="number" data-type="floor"  data-border="max")-->
          </div>
        </div>
        <div class="s3d-filter__row">
          <div class="s3d-filter__row__title">${i18n.t('area')} м<sup>2</sup></div>
          <div class="s3d-filter__row__list js-filter-range">
            <!--label з-->
            <!--    input.js-s3d-filter__area__min--input( type="number" data-type="area" data-border="min")-->
            <input class="js-s3d-filter__area--input" data-type="area" data-min="5" data-max="555" data-from="5" data-to="555">
            <!--label по-->
            <!--    input.js-s3d-filter__area__max--input(type="number" data-type="area" data-border="max")-->
          </div>
        </div>
        <div class="s3d-filter__row s3d-filter__offset-bottom-none js-s3d-filter__checkboxes">
          <!--.s3d-filter-select__title Кімнат-->
          <div class="s3d-filter-checkboxes">
            <div class="s3d-filter__checkbox">
              <input type="checkbox" data-type="rooms" data-rooms="1" id="rooms-1">
              <label class="s3d-filter__checkbox--label" for="rooms-1">1к</label>
            </div>
            <div class="s3d-filter__checkbox">
              <input type="checkbox" data-type="rooms" data-rooms="2" id="rooms-2">
              <label class="s3d-filter__checkbox--label" for="rooms-2">2к</label>
            </div>
            <div class="s3d-filter__checkbox">
              <input type="checkbox" data-type="rooms" data-rooms="3" id="rooms-3">
              <label class="s3d-filter__checkbox--label" for="rooms-3">3к</label>
            </div>
            <div class="s3d-filter__checkbox">
              <input type="checkbox" data-type="rooms" data-rooms="4" id="rooms-4">
              <label class="s3d-filter__checkbox--label" for="rooms-4">4к</label>
            </div>
          </div>
          <button class="s3d-filter__reset s3d-filter__reset-desktop" type="button" id="resetFilter">
          <svg class="s3d-filter__reset-icon" role="presentation">
            <use xlink:href="#icon-reset"></use>
          </svg>
          <span>${i18n.t('Filter.reset')}</span>
        </button>
        </div>
        <div class="s3d-filter__row s3d-filter__offset-bottom-none">
          <button class="s3d-filter__reset s3d-filter__reset-mobile" type="button" id="resetFilter-mobile">
            <svg class="s3d-filter__reset-icon" role="presentation">
              <use xlink:href="#icon-reset"></use>
            </svg>
            <span>${i18n.t('Filter.reset')}</span>
          </button>
          <button class="s3d-filter__apply js-s3d-filter__button--apply" type="button">
            <span>${i18n.t('Filter.apply')}</span>
          </button>
        </div>
      </div>
      <div class="s3d-filter__mini-info js-s3d-filter__mini-info">
      <div class="s3d-filter__mini-info__elem s3d-filter__mini-info__floor" data-type="floor">
        <div class="s3d-filter__mini-info__title">${i18n.t('floor')}:</div>
        <div class="s3d-filter__mini-info__amount s3d-filter__mini-info__amount">
          <span>${i18n.t('Filter.from')}</span>
          <span class="js-s3d-filter__mini-info__floor--amount-from" data-type="min">0</span>
          <span>${i18n.t('Filter.to')}</span>
          <span class="js-s3d-filter__mini-info__floor--amount-to" data-type="max">50</span>
        </div>
      </div>
      <div class="s3d-filter__mini-info__elem s3d-filter__mini-info__area" data-type="area">
        <div class="s3d-filter__mini-info__title">${i18n.t('area')} м2:</div>
        <div class="s3d-filter__mini-info__amount s3d-filter__mini-info__amount">
          <span>${i18n.t('Filter.from')}</span>
          <span class="js-s3d-filter__mini-info__area--amount-from" data-type="min">0</span>
          <span>${i18n.t('Filter.to')}</span>
          <span class="js-s3d-filter__mini-info__area--amount-to" data-type="max">1000</span>
        </div>
      </div>
      <div class="s3d-filter__mini-info__elem s3d-filter__mini-info__flat" data-type="rooms">
        <div class="s3d-filter__mini-info__title">${i18n.t('rooms')}:</div>
        <div class="s3d-filter__mini-info__amount s3d-filter__mini-info__amount">
          <span class="js-s3d-filter__mini-info__flat--amount" data-type="amount">1, 2</span>
        </div>
      </div>
    </div>
      <div class="s3d-filter__hide" id="hideFilter" data-hide-text="${i18n.t('Filter.hide')}" data-show-text="${i18n.t('Filter.show')}">${i18n.t('Filter.hide')}</div>
    </div>
    <div class="s3d-filter__table js-s3d-filter__table">
      <div class="s3d-filter__head js-s3d-filter__head">
          <div class="s3d-filter__tr">
            <div class="s3d-filter__th--offset" data-sort="none"></div>
            <div class="s3d-filter__th" data-sort="none">
              ${i18n.t('type')}
            </div>
            <div class="s3d-filter__th" data-sort="rooms">
              ${i18n.t('rooms')}
              <svg class="s3d-sort__arrow" width="5" height="3" viewBox="0 0 5 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-4.76837e-07 3L2.5 2.5828e-07L5 3L2.87764 3L2.12236 3L-4.76837e-07 3Z"></path>
              </svg>
            </div>
            <div class="s3d-filter__th" data-sort="floor">
              ${i18n.t('floor')}
              <svg class="s3d-sort__arrow" width="5" height="3" viewBox="0 0 5 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-4.76837e-07 3L2.5 2.5828e-07L5 3L2.87764 3L2.12236 3L-4.76837e-07 3Z"></path>
              </svg>
            </div>
            <div class="s3d-filter__th" data-sort="area">
              ${i18n.t('area')} м<sup>2</sup>
              <svg class="s3d-sort__arrow" width="5" height="3" viewBox="0 0 5 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-4.76837e-07 3L2.5 2.5828e-07L5 3L2.87764 3L2.12236 3L-4.76837e-07 3Z"></path>
              </svg>
            </div>
            <div class="s3d-filter__th" data-sort="none">${i18n.t('favourite--add')}</div>
            <div class="s3d-filter__th--offset" data-sort="none"></div>
          </div>
        </div>
      <table>
        <colgroup>
          <col>
          <col span="5" ><!-- С помощью этой конструкции задаем цвет фона для первых двух столбцов таблицы-->
          <col>
        </colgroup>
        
        
        <tbody class="s3d-filter__body js-s3d-filter__body"></tbody>
      </table>
    </div>
    <picture class="s3d-filter__bg">
        <source media="(min-width:993px)" srcset="/wp-content/themes/${nameProject}/assets/s3d/images/filter-bg.jpg">
        <source media="(min-width:601px;max-width:992px)" srcset="/wp-content/themes/${nameProject}/assets/s3d/images/filter-bg-table.jpg">
        <source media="(max-width:600px)" srcset="/wp-content/themes/${nameProject}/assets/s3d/images/filter-bg.jpg">
        <img src="/wp-content/themes/${nameProject}/assets/s3d/images/filter-bg.jpg" />
    </picture>
 
    <div class="s3d-filter__amount-flat">${i18n.t('found')}
    <span class="s3d-filter__amount-flat__num js-s3d__amount-flat__num">25</span>
    ${i18n.t('found--from')}
    <span class="s3d-filter__amount-flat__num js-s3d__amount-flat__num-all">456</span></div>
  </div>
`;
}

export default Filter;

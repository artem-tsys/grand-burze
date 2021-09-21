function Filter(i18n) {
  return `
  <div class="s3d-filter-wrap js-s3d-filter">
    <div class="s3d-filter__close-wrap js-s3d-filter__close">
      <div class="s3d-filter__close"><span></span><span></span></div>
    </div>
    <div class="s3d-filter__top">
      <div class="s3d-filter__title"><span>підбір за параметрами</span></div>
      <div class="s3d-filter">
        <div class="s3d-filter__row">
          <div class="s3d-filter__row__title">Поверх</div>
          <div class="s3d-filter__row__list js-filter-range">
            <!--label з-->
            <!--    input.js-s3d-filter__floor__min--input(type="number" data-type="floor"  data-border="min")-->
            <input class="js-s3d-filter__floor--input" data-type="floor" data-min="1" data-max="15" data-from="1" data-to="15">
            <!--label по-->
            <!--    input.js-s3d-filter__floor__max--input(type="number" data-type="floor"  data-border="max")-->
          </div>
        </div>
        <div class="s3d-filter__row">
          <div class="s3d-filter__row__title">Площа м<sup>2</sup></div>
          <div class="s3d-filter__row__list js-filter-range">
            <!--label з-->
            <!--    input.js-s3d-filter__area__min--input( type="number" data-type="area" data-border="min")-->
            <input class="js-s3d-filter__area--input" data-type="area" data-min="5" data-max="555" data-from="5" data-to="555">
            <!--label по-->
            <!--    input.js-s3d-filter__area__max--input(type="number" data-type="area" data-border="max")-->
          </div>
        </div>
        <div class="s3d-filter__row js-s3d-filter__checkboxes">
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
            <label class="s3d-filter__checkbox" for="rooms-3">
              <input type="checkbox" data-type="rooms" data-rooms="3" id="rooms-3">
              <span class="s3d-filter__checkbox-value">3к</span>
            </label>
            <div class="s3d-filter__checkbox">
              <input type="checkbox" data-type="rooms" data-rooms="4" id="rooms-4">
              <label class="s3d-filter__checkbox--label" for="rooms-4">4к</label>
            </div>
          </div>
          <button class="s3d-filter__reset" type="button" id="resetFilter">
          <svg class="s3d-filter__reset-icon" role="presentation">
            <use xlink:href="#icon-reset"></use>
          </svg>
          <span>Очистить</span>
        </button>
        </div>
        
      </div>
      <div class="s3d-filter__mini-info js-s3d-filter__mini-info">
      <div class="s3d-filter__mini-info__elem s3d-filter__mini-info__floor" data-type="floor">
        <div class="s3d-filter__mini-info__title">Поверх:</div>
        <div class="s3d-filter__mini-info__amount s3d-filter__mini-info__amount"><span>от</span><span class="js-s3d-filter__mini-info__floor--amount-from" data-type="min">0</span><span>до</span><span class="js-s3d-filter__mini-info__floor--amount-to" data-type="max">50</span></div>
      </div>
      <div class="s3d-filter__mini-info__elem s3d-filter__mini-info__area" data-type="area">
        <div class="s3d-filter__mini-info__title">Площадь м2:</div>
        <div class="s3d-filter__mini-info__amount s3d-filter__mini-info__amount"><span>от</span><span class="js-s3d-filter__mini-info__area--amount-from" data-type="min">0</span><span>до</span><span class="js-s3d-filter__mini-info__area--amount-to" data-type="max">1000</span></div>
      </div>
      <div class="s3d-filter__mini-info__elem s3d-filter__mini-info__flat" data-type="rooms">
        <div class="s3d-filter__mini-info__title">Комнат:</div>
        <div class="s3d-filter__mini-info__amount s3d-filter__mini-info__amount">
          <span class="js-s3d-filter__mini-info__flat--amount" data-type="amount">1, 2</span>
        </div>
      </div>
    </div>
      <div class="s3d-filter__hide" id="hideFilter" ><span>Скрыть</span></div>
    </div>
    <div  class="s3d-filter__table js-s3d-filter__table">
      <table>
        <colgroup>
          <col>
          <col span="5" ><!-- С помощью этой конструкции задаем цвет фона для первых двух столбцов таблицы-->
          <col>
        </colgroup>
        
        <thead class="s3d-filter__head js-s3d-filter__head">
          <tr class="s3d-filter__tr">
            <th class="s3d-filter__th--offset" data-sort="none"></th>
            <th class="s3d-filter__th" data-sort="none">
              Тип
            </th>
            <th class="s3d-filter__th" data-sort="rooms">
              Комнат
              <svg class="s3d-sort__arrow" width="5" height="3" viewBox="0 0 5 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-4.76837e-07 3L2.5 2.5828e-07L5 3L2.87764 3L2.12236 3L-4.76837e-07 3Z"></path>
              </svg>
            </th>
            <th class="s3d-filter__th" data-sort="floor">
              Этаж
              <svg class="s3d-sort__arrow" width="5" height="3" viewBox="0 0 5 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-4.76837e-07 3L2.5 2.5828e-07L5 3L2.87764 3L2.12236 3L-4.76837e-07 3Z"></path>
              </svg>
            </th>
            <th class="s3d-filter__th" data-sort="area">
              Площадь м<sup>2</sup>
              <svg class="s3d-sort__arrow" width="5" height="3" viewBox="0 0 5 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-4.76837e-07 3L2.5 2.5828e-07L5 3L2.87764 3L2.12236 3L-4.76837e-07 3Z"></path>
              </svg>
            </th>
            <th class="s3d-filter__th" data-sort="none">В избранное</th>
            <th class="s3d-filter__th--offset" data-sort="none"></th>
          </tr>
        </thead>
        <tbody class="s3d-filter__body js-s3d-filter__body"></tbody>
      </table>
    </div>
    <img class="s3d-filter__bg" src="/wp-content/themes/template/assets/s3d/images/filter-bg.jpg" />
    <div class="s3d-filter__amount-flat">Знайдено<span class="s3d-filter__amount-flat__num js-s3d__amount-flat__num">25</span>из<span class="s3d-filter__amount-flat__num js-s3d__amount-flat__num-all">456</span></div>
  </div>
`;
}

export default Filter;

function Controller(i18n) {
  return `<div class="s3d-ctr js-s3d-ctr unselectable" data-type="complex">
    <div class="s3d-ctr__filter js-s3d-ctr__filter">
      <div class="s3d-ctr__filter__icon">
        <svg width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line y1="2.5" x2="26" y2="2.5" stroke="#2D2D2D"></line>
          <line y1="18.5" x2="26" y2="18.5" stroke="#2D2D2D"></line>
          <line y1="10.5" x2="26" y2="10.5" stroke="#2D2D2D"></line>
          <circle cx="20.5" cy="2.5" r="2" fill="#F3EFE9" stroke="#2D2D2D"></circle>
          <circle cx="20.5" cy="18.5" r="2" fill="#F3EFE9" stroke="#2D2D2D"></circle>
          <circle cx="5.5" cy="10.5" r="2" fill="#F3EFE9" stroke="#2D2D2D"></circle>
        </svg>
      </div>
      <span class="s3d-ctr__filter__text">${i18n.t('ctr.filterBtn')}</span>
    </div>
    <div class="s3d__compass s3d-ctr__compass js-s3d-ctr__compass">
      <svg class="icon--Compass" role="presentation">
        <use xlink:href="#icon-Compass"></use>
      </svg>
    </div>
    <div class="s3d-ctr__nav js-s3d-ctr__elem">
      <div class="s3d-ctr__nav__title">${i18n.t('ctr.nav.title')}</div>
      <div class="s3d-nav__btn s3d-ctr__option">
        <div class="s3d-ctr__option__title">${i18n.t('ctr.nav.flyby--name')}</div>
        <div class="s3d-ctr__option__text js-s3d-ctr__option__text"></div>
        <div class="s3d-ctr__option__buttons">
          <button class="s3d-nav__btn js-s3d-nav__btn active" data-type="genplan">${i18n.t('ctr.nav.genplan')}</button>
          <button class="s3d-nav__btn js-s3d-nav__btn" data-type="flyby" data-flyby="1" data-side="outside">${i18n.t('ctr.nav.flyby_1_outside')}</button>
          <button class="s3d-nav__btn js-s3d-nav__btn" data-type="flyby" data-flyby="2" data-side="outside">${i18n.t('ctr.nav.flyby_2_outside')}</button>
        </div>
      </div>
      <button class="s3d-nav__btn js-s3d-nav__btn" type="button" data-type="plannings">
        ${i18n.t('ctr.nav.plannings')}
      </button>
      <button class="s3d-nav__btn js-s3d-nav__btn" type="button" data-type="floor" disabled>${i18n.t('ctr.nav.floor')}</button>
      <button class="s3d-nav__btn js-s3d-nav__btn" type="button" data-type="flat" disabled>${i18n.t('ctr.nav.flat')}</button>
    </div>
    <div class="s3d-ctr__title js-s3d-ctr__title">${i18n.t('ctr.title')}</div>
    <div class="s3d__choose--flat js-s3d__choose--flat">
        <div class="s3d__choose--flat--button-bg js-s3d__choose--flat--button-svg"><svg viewBox="0 0 145 44" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 22C0 9.84974 9.84973 0 22 0H123C135.15 0 145 9.84974 145 22C145 34.1503 135.15 44 123 44H22C9.84974 44 0 34.1503 0 22Z"/>
        </svg></div>
        <label class="s3d__choose--flat--button" data-choose-type="flat">
      <input type="radio" name="chooseFlat" checked value='flat'/>
    <span>${i18n.t('ctr.chooseOfApartment')}</span></label>
        <label class="s3d__choose--flat--button" data-choose-type="floor">
      <input type="radio" name="chooseFlat" value='floor'/>
    <span>${i18n.t('ctr.chooseOfFloor')}</span></label>
</div>
    <div class="js-s3d-infoBox s3d-infoBox" data-s3d-type="infoBox"></div>
    <button class="s3d-ctr__helper js-s3d-ctr__helper">
      <div class="s3d-ctr__helper--text">${i18n.t('ctr.repeatHelp')}</div>
    </button>
  </div>`;
}

export default Controller;

import $ from 'jquery';

class Svg {
  constructor(data) {
    this.activeSlide = data.activeElem;
    this.setActiveSvg = data.setSvgActive;
    this.type = data.type;
    this.setting = data.settings;
    this.wrapper = data.wrapper;
    this.controlPoint = data.controlPoint;
    this.hoverData$ = data.hoverData$;
    this.typeSelectedFlyby$ = data.typeSelectedFlyby$;
  }

  async init() {
    this.wrapper.find('.s3d__svg-container').remove();
    await this.createSvg(this.controlPoint, this.type, this.typeSelectedFlyby$);
  }

  // получает
  async createSvg(data, name, typeSelectedFlyby$) {
    const svgContainer = createMarkup('div', { class: `s3d__svg-container js-s3d__svg-container__${name}` });
    this.wrapper.find('.js-s3d__wrapper__canvas').append(svgContainer);
    const promiseList = data.map(key => new Promise(resolve => {
      const svgWrap = document.createElement('div');
      if (+key === +this.activeSlide) {
        svgWrap.classList = `s3d__svgWrap js-s3d__svgWrap ${this.type}__${key} s3d__svg__active`;
      } else {
        svgWrap.classList = `s3d__svgWrap js-s3d__svgWrap ${this.type}__${key}`;
      }
      svgWrap.dataset.id = key;
      $(svgContainer).append(svgWrap);

      let path = '';
      if (this.setting.type && this.setting.flyby && this.setting.side) {
        path = `${defaultModulePath}/images/svg/${typeSelectedFlyby$.value}/${this.setting.type}/${this.setting.flyby}/${this.setting.side}/${key}.svg`;
      } else {
        path = `${defaultModulePath}/images/svg/${this.setting.type}/${key}.svg`;
      }
      // const path = `${defaultModulePath}/images/svg/${typeSelectedFlyby$.value}/${this.setting.type}/${this.setting.flyby}/${this.setting.side}/${key}.svg`;
      const defaultPath = `${defaultModulePath}/images/svg/default.svg`;
      $.ajax(path)
        .done(svg => {
          $(svgWrap).append(svg.documentElement);
          // this.showAvailableFlat();
          resolve();
        }).fail((jqXHR, error) => {
          $.ajax(defaultPath)
            .done(svg => {
              $(svgWrap).append(svg.documentElement);
              // this.showAvailableFlat();
              resolve();
            }).fail(error => {
              console.error(error);
            });
        });
    }));

    return Promise.all(promiseList);
    // .then(result => {
    // this.setActiveSvg(+this.activeSlide);
    // this.showAvailableFlat();
    // });

    // при клике на инфруструктуру получает данные с сервера и вставляет в попап
    // $('.js-s3d__svg-container').on('click', '.js-s3d-svg__point-group', function () {
    //   $.ajax({
    //     url: '/wp-admin/admin-ajax.php',
    //     method: 'POST',
    //     data: {
    //       action: 'markerPopup',
    //       type: this.dataset.type,
    //     },
    //   }).done(response => JSON.parse(response)).done(res => {
    //     const answer = JSON.parse(res);
    //     $('.s3d-point__help-img').attr('src', answer.img);
    //     $('.s3d-point__help-title').html((answer.title || $(this).html()));
    //     $('.s3d-point__help-text').html(answer.text);
    //     $('.s3d-point__help-button').attr('href', (answer.url.url || '#')).html((answer.url.name || 'Детальнее'));
    //     $('.js-s3d-point__help').addClass('point-active');
    //   });
    // });
    // закрывает попап инфрструктуры
    // $('.js-s3d-point__help').on('click', '.js-s3d-point__help-close', () => {
    //   $('.js-s3d-point__help').removeClass('point-active');
    // });
  }

  // showAvailableFlat() {
  //   if ($('.js-s3d-controller__showFilter--input').prop('checked')) {
  //     $('.js-s3d-svg__point-group').css({ opacity: '1', display: 'flex' });
  //     return;
  //   }
  //   $('.js-s3d-svg__point-group').css({ opacity: '0', display: 'none' });
  // }
}

export default Svg;

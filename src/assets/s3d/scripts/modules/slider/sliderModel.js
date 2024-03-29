import $ from 'jquery';
import { BehaviorSubject } from 'rxjs';
import { size } from 'lodash';
import EventEmitter from '../eventEmitter/EventEmitter';
import {
  preloader, debounce, preloaderWithoutPercent,
} from '../general/General';
import Svg from '../Svg';

class SliderModel extends EventEmitter {
  constructor(config) {
    super();
    this.type = config.type;
    this.id = config.id;
    this.settings = config.settings;
    this.browser = config.browser;
    // this.nextSlideId = config.activeSlide;
    this.imageUrl = config.imageUrl;
    this.activeElem = config.activeSlide;
    this.controlPoint = config.controlPoint;
    this.getFlat = config.getFlat;
    this.activeFlat = config.activeFlat;
    this.hoverData$ = config.hoverData$;
    this.numberSlide = config.numberSlide;
    this.infoBox = config.infoBox;
    this.typeSelectedFlyby$ = config.typeSelectedFlyby$;
    this.currentFilteredFlatIds$ = config.currentFilteredFlatIds$;
    this.currentFilteredFloorsData$ = config.currentFilteredFloorsData$;

    this.compass = config.compass;
    this.currentCompassDeg = 0;
    this.startDegCompass = config.startDegCompass;

    this.updateFsm = config.updateFsm;
    this.wrapper = config.wrapper;
    this.wrapperEvent = '.js-s3d__svgWrap';
    // images in slider
    this.ctx = this.wrapper.find(`#js-s3d__${this.id}`)[0].getContext('2d'); // Контекст
    this.height = 1080;
    this.width = 1920;
    // images in slider end
    // this.openbuilds = [1]
    // data for rotate
    this.x = 0;
    this.pret = 0;
    this.amountSlideForChange = 0;
    this.arrayImages = [];
    this.mouseSpeed = config.mouseSpeed;
    this.rotateSpeedDefault = config.rotateSpeedDefault;
    this.rotateSpeed = config.rotateSpeed;
    this.nearestControlPoint = {
      min: config.numberSlide.min,
      max: config.numberSlide.max,
    };
    // data for rotate end

    // flags
    this.isKeyDown = false;
    this.isRotating$ = new BehaviorSubject(false); // вращается сейчас слайдер или нет
    // flags end

    this.activeSvg = null;
    this.animates = () => {};
    this.Activebuild = config.Activebuild;
    this.progress = 0;
    this.preloader = preloader;
    this.preloaderWithoutPercent = preloaderWithoutPercent();
    this.browser = config.browser;

    this.init = this.init.bind(this);
    this.changeNext = this.changeNext.bind(this);
    this.changePrev = this.changePrev.bind(this);
    this.toSlideNum = this.toSlideNum.bind(this);
    this.setSvgActive = this.setSvgActive.bind(this);
  }

  sliderRotateEnd(event) {
    if (event.target.classList.contains('s3d__button')
      || event.target.classList.contains('s3d-infoBox__link')
    ) return;
    this.activeAnimateFrame(false);

    if (this.isKeyDown) {
      this.isKeyDown = false;
      this.emit('changeContainerCursor', 'grab');
      if (!this.controlPoint.includes(this.activeElem)) {
        this.checkDirectionRotate();
      } else {
        this.changeSvgActive(this.activeElem);
        this.emit('showActiveSvg');
        this.infoBox.disable(false);
      }
    }
  }

  sliderRotateStart(event) {
    if (event.target.classList.contains('s3d__button')
      || this.isRotating$.value
      || event.target.classList.contains('s3d-infoBox__link') // если клик по кнопкам/ссылке или модуль вращается то выходим
    ) return;
    this.isKeyDown = true;
    this.emit('changeContainerCursor', 'grabbing');
    this.cancelAnimateSlide();
    this.writingStartPosCursor.call(this, event);
    this.activeAnimateFrame(true);
  }

  mouseMoveHandler(event) {
    if (this.isRotating$.value) {
      return;
    }

    if (this.isKeyDown) {
      this.infoBox.disable(true);
      this.emit('hideActiveSvg');
      this.checkMouseMovement.call(this, event);
    } else if (event.target.tagName === 'polygon') {
      const config = {
        ...event.target.dataset,
      };

      this.infoBox.updatePosition(event);
      this.infoBox.changeState('hover', config);
    } else {
      this.infoBox.changeState('static');
    }
  }

  touchPolygonHandler(event) {
    event.preventDefault();
    if (this.isRotating$.value) {
      return;
    }
    const mapping = {
      section: type => this.updateFsm({ type, ...event.currentTarget.dataset }),
      flyby: type => this.updateFsm({ type, ...event.currentTarget.dataset }),
      floor: type => this.updateFsm({ type, ...event.currentTarget.dataset }),
      flat: type => this.updateFsm({ type, ...event.currentTarget.dataset }),
    };

    // todo: нужно переписать нормально, убрать условные конструкции
    const { type, id } = event.currentTarget.dataset;
    if (type === 'flat') {
      if (!id) return;
      const flat = this.getFlat(+id);
      if (flat.sale !== 1) return;
    }

    this.infoBox.changeState('static');
    if (mapping[type]) {
      mapping[type](type);
    }
  }

  touchPolygonMobileHandler(event) {
    event.preventDefault();
    if (this.isRotating$.value) {
      return;
    }
    const config = {
      ...event.target.dataset,
    };
    this.emit('showSelectPolygon', event.target);
    this.infoBox.changeState('hover', config);
  }

  keyPressHandler(event) {
    let data;
    switch (event.keyCode) {
        case 37:
        case 100:
          data = 'prev';
          break;
        case 39:
        case 102:
          data = 'next';
          break;
        default:
          return false;
    }
    this.checkDirectionRotate(data);
    return true;
  }

  getSvgActive() {
    return this.activeSvg;
  }

  setSvgActive(svg) {
    if (typeof svg === 'string' || typeof svg === 'number') {
      this.activeSvg = $(`.${this.type}__${svg}`);
    } else {
      this.activeSvg = svg;
    }
  }

  changeSvgActive(id) {
    this.setSvgActive(id);
    this.emit('changeSvgActive', this.getSvgActive());
  }

  mappingSelectedTypePoly = {
    floor: () => {
      this.emit('filteredPolygonRemoveClass');
      const floors = this.currentFilteredFloorsData$.value;
      this.emit('showSelectedFloors', floors);
    },
    flat: () => {
      this.emit('filteredPolygonRemoveClass');
      const flats = this.currentFilteredFlatIds$.value;
      this.emit('showSelectedFlats', flats);
    },
  };

  init(id, slide) {
    if (id && slide && slide.length > 0) {
      this.activeElem = +slide[0];
      this.hoverData$.next({ id });
      this.emit('changeFlatActive', id);
    }
    // this.emit('createSvg', this);
    this.emit('createBackground');
    this.emit('createArrow');
    this.isRotating$.subscribe(value => {
      this.infoBox.disable(value);
    });

    this.typeSelectedFlyby$.subscribe(async type => {
      // this.emit('changeSvg', this, type);
      const svg = new Svg(this);
      await svg.init();
      this.setSvgActive(this.activeElem);

      const selectedTypePoly = this.mappingSelectedTypePoly[type];
      selectedTypePoly();
    });

    this.currentFilteredFloorsData$.subscribe(_ => {
      const selectedTypePoly = this.mappingSelectedTypePoly['floor'];
      selectedTypePoly();
    });

    this.currentFilteredFlatIds$.subscribe(_ => {
      const selectedTypePoly = this.mappingSelectedTypePoly['flat'];
      selectedTypePoly();
    });

    // firstLoadImage должен быть ниже функций create
    this.uploadPictures();
    this.emit('changeContainerCursor', 'grab');
    this.deb = debounce(this.resizeCanvas.bind(this), 400);
    $(window).resize(() => {
      this.deb(this);
    });
  }

  updateCompass(activeSlide) {
    if (activeSlide) {
      this.currentCompassDeg = (360 / this.numberSlide.max * activeSlide) + (360 / this.numberSlide.max * this.startDegCompass);
    }
    this.compass(this.currentCompassDeg);
  }

  // ---- загрузка картинок слайдера ----
  async uploadPictures() {
    this.isRotating$.next(true);
    this.preloader.turnOn(this.wrapper.find('.s3d__button'));
    this.preloader.turnOn($('.s3d-ctr__option .js-s3d-nav__btn'));
    this.ctx.canvas.width = this.width;
    this.ctx.canvas.height = this.height;


    this.uploadPicture = (index, cb, countRepeatLoad = 0) => {
      const self = this;
      const img = new Image();

      const promise = new Promise((resolve, reject) => {
        img.dataset.id = index;
        img.onload = function () {
          self.arrayImages[index] = this;
          self.progressBarUpdate();
          if (cb) {
            cb(img);
          }
          resolve(img);
        };
        img.onerror = function (e) {
          if (countRepeatLoad === 5) {
            self.sendResponsiveError(this, self);
            reject(e);
          } else {
            self.uploadPicture(+this.dataset.id, resolve, countRepeatLoad + 1);
          }
        };
      });
      img.src = `${defaultModulePath}/${self.imageUrl}${index}.jpg`;
      return promise;
    };

    const promises = [];
    await this.uploadPicture(this.activeElem, img => {
      this.updateCompass(this.activeElem);
      this.ctx.drawImage(img, 0, 0, this.width, this.height);
      setTimeout(() => {
        this.preloader.hide();
        this.preloader.miniOn();
      }, 300);
      this.resizeCanvas();
    });

    for (let i = 0; i <= this.numberSlide.max; i++) {
      promises[i] = this.uploadPicture(i);
    }
    Promise.all(promises).then(values => {
      this.arrayImages = values;
      this.resizeCanvas();
      setTimeout(() => {
        this.preloader.miniOff();
        this.preloader.turnOff($(this.wrapper).find('.s3d__button'));
        this.preloader.turnOff($('.s3d-ctr__option .js-s3d-nav__btn'));
      }, 500);
      this.isRotating$.next(false);
      this.changeSvgActive(this.activeElem);
      this.emit('showActiveSvg');
      this.infoBox.disable(false);
      if (this.activeFlat) {
        this.emit('changeFlatActive', this.hoverData$.value);
        this.infoBox.changeState('active', { id: this.activeFlat });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  sendResponsiveError(elem, self) {
    const res = Object.assign(self.browser, {
      project: 'template--wp',
      url: elem.src || elem.dataset.id || 'пусто',
      type: 'error',
      text: 'new',
    });
    $.ajax('/wp-admin/admin-ajax.php', {
      method: 'POST',
      data: {
        data: res, action: '3dDebuger',
      },
    }).then(resolve => console.log(resolve));
  }

  // высчитывает прогресс загрузки картинок
  progressBarUpdate() {
    if (this.progress >= this.numberSlide.max) {
      setTimeout(() => {
        this.emit('progressBarHide');
      }, 300);
      return;
    }
    this.progress += 1;
    const percent = this.progress * (100 / (this.numberSlide.max + 1));
    this.emit('updateLoaderProgress', Math.ceil(percent));
  }
  // ---- загрузка картинок слайдера end ----

  resizeCanvas() {
    const factorW = this.width / this.height;
    const factorH = this.height / this.width;
    const canvas = $(`#js-s3d__${this.id}`);
    const width = this.wrapper.width();
    const height = this.wrapper.height();
    const diffW = this.width / width;
    const diffH = this.height / height;

    if (diffW < diffH) {
      canvas.width(width);
      canvas.height(width * factorH);
    } else {
      canvas.height(height);
      canvas.width(height * factorW);
    }

    this.centerSlider(this.wrapper[0]);
  }

  // центрует слайдер (после загрузки или resize)
  centerSlider(elem) {
    const scroll = (elem.scrollWidth - document.documentElement.offsetWidth) / 2;
    this.wrapper.scrollLeft(scroll);
  }

  // записывает начальные позиции мышки
  writingStartPosCursor(e) {
    this.x = e.pageX || e.targetTouches[0].pageX;
    this.pret = e.pageX || e.targetTouches[0].pageX;
  }

  // получить массив с номерами svg на которых есть polygon с data-id переданый аргументом
  getNumSvgWithFlat(id) {
    const data = $(`.js-s3d__svgWrap polygon[data-id=${id}]`)
      .map((i, poly) => +poly.closest('.js-s3d__svgWrap').dataset.id).toArray();
    return data ?? [];
  }

  // start block  change slide functions
  // находит ближайший слайд у которого есть polygon(data-id) при необходимости вращает модуль к нему
  toSlideNum(id, slides) {
    let needChangeSlide = true;
    let pointsSlide;
    if (slides) {
      needChangeSlide = !slides.includes(this.activeElem);
      pointsSlide = slides;
    }
    if (needChangeSlide) {
      this.checkDirectionRotate(undefined, pointsSlide);
    }
    this.hoverData$.next({ id });
    this.emit('changeFlatActive', { id });
    this.scrollWrapToActiveFlat(this.determinePositionActiveFlat(id, pointsSlide[0]));
    this.infoBox.changeState('active', { id });
  }

  // запускает callback (прокрутку слайда) пока активный слайд не совпадёт со следующим (выявленным заранее)
  repeatChangeSlide(fn, nextSlideId) {
    this.isRotating$.next(true);
    const rotateSpeed = this.rotateSpeed.reduce((acc, data) => {
      if ((data.min === nextSlideId && data.max === this.activeElem) || (data.max === nextSlideId && data.min === this.activeElem)) {
        return data.ms;
      }
      return acc;
    }, this.rotateSpeedDefault);

    return setInterval(() => {
      fn();
      if (this.activeElem === nextSlideId) {
        this.cancelAnimateSlide();
        this.changeSvgActive(nextSlideId);
        this.emit('showActiveSvg');
        this.emit('changeFlatActive', this.hoverData$.value);
        this.infoBox.disable(false);
        this.isRotating$.next(false);
        this.amountSlideForChange = 0;
      }
    }, rotateSpeed);
  }

  showDifferentPointWithoutRotate(arrayIdNewPoint, flatId) {
    let arraySlides;
    // debugger;
    if (arrayIdNewPoint) {
      arraySlides = arrayIdNewPoint;
    } else {
      arraySlides = this.getNumSvgWithFlat(flatId);
    }

    if (!arraySlides || arraySlides.length === 0) {
      return;
    }
    // debugger;
    this.rewindToPoint(arraySlides);
    const idNewPoint = arraySlides[0];

    this.ctx.drawImage(this.arrayImages[idNewPoint], 0, 0, this.width, this.height);
    this.activeElem = idNewPoint;
    this.changeSvgActive(idNewPoint);
    this.emit('showActiveSvg');

    this.isRotating$.next(false);

    if (flatId) {
      this.hoverData$.next({ id: flatId });
      this.emit('changeFlatActive', { id: flatId });
      this.infoBox.changeState('active', { id: flatId });
    }
  }

  checkDirectionRotate(data, points = this.controlPoint) {
    if (this.isRotating$.value) return;
    this.emit('hideActiveSvg');
    this.rewindToPoint(points);
    const dataNextPoint = this.checkResult(points, data);
    let fn;
    if (dataNextPoint.direction === 'next') {
      fn = this['changeNext'];
    } else {
      fn = this['changePrev'];
    }
    this.repeat = this.repeatChangeSlide(fn, dataNextPoint.nextPoint);
  }

  checkResult(points, type) {
    if (type === 'next' || (type === undefined && ((this.nearestControlPoint.max - this.nearestControlPoint.min) / 2) + this.nearestControlPoint.min <= this.activeElem)
    ) {
      if (this.nearestControlPoint.max <= this.numberSlide.max) {
        return { direction: 'next', nextPoint: this.nearestControlPoint.max };
      }
      return { direction: 'next', nextPoint: points[0] };
    }
    if (this.nearestControlPoint.min > this.numberSlide.min) {
      return { direction: 'prev', nextPoint: this.nearestControlPoint.min };
    }
    return { direction: 'prev', nextPoint: points[points.length - 1] };
  }

  determinePositionActiveFlat(id, numSlide) {
    const element = $(`.js-s3d__svgWrap[data-id=${numSlide}] polygon[data-id=${id}]`);
    if (size(element) === 0) {
      return 0;
    }
    const pos = element[0].getBBox();
    const left = (pos.x + (element[0].getBoundingClientRect().width / 2)) - (document.documentElement.offsetWidth / 2);
    return left < 0 ? 0 : left;
  }

  scrollWrapToActiveFlat(left) {
    this.wrapper.scrollLeft(left);
  }

  // остановка анимации и сброс данных прокрутки
  cancelAnimateSlide() {
    clearInterval(this.repeat);
    this.repeat = undefined;
    this.nearestControlPoint.min = this.numberSlide.min;
    this.nearestControlPoint.max = this.numberSlide.max;
  }

  // меняет слайд на следующий
  changeNext() {
    if (this.activeElem === this.numberSlide.max) {
      this.nearestControlPoint.max = this.controlPoint[0];
      this.nearestControlPoint.min = -1;
      this.activeElem = this.numberSlide.min;
    } else {
      this.activeElem++;
    }
    this.updateCompass(this.activeElem);
    this.ctx.drawImage(this.arrayImages[this.activeElem], 0, 0, this.width, this.height);
  }

  // меняет слайд на предыдщий
  changePrev() {
    if (this.activeElem === this.numberSlide.min) {
      this.nearestControlPoint.max = this.numberSlide.max + 1;
      this.nearestControlPoint.min = this.controlPoint[this.controlPoint.length - 1];
      this.activeElem = this.numberSlide.max;
    } else {
      this.activeElem--;
    }
    this.updateCompass(this.activeElem);
    this.ctx.drawImage(this.arrayImages[this.activeElem], 0, 0, this.width, this.height);
  }

  checkMouseMovement(e) {
    // get amount slide from a touch event
    this.x = e.pageX ?? e.targetTouches[0].pageX;
    const count = (this.x - this.pret) / (window.innerWidth / this.numberSlide.max / this.mouseSpeed);
    this.amountSlideForChange += window.parseInt(count.toFixed(0));
  }

  rewindToPoint(controlPoint) {
    this.cancelAnimateSlide();
    controlPoint.forEach(el => {
      if (+el < this.activeElem && +el > this.nearestControlPoint.min) {
        this.nearestControlPoint.min = +el;
      } else if (+el > this.activeElem && +el < this.nearestControlPoint.max) {
        this.nearestControlPoint.max = +el;
      }
    });

    if (this.nearestControlPoint.min === 0) {
      this.nearestControlPoint.min = controlPoint[controlPoint.length - 1] - this.numberSlide.max;
    }

    if (this.nearestControlPoint.max === this.numberSlide.max) {
      this.nearestControlPoint.max = controlPoint[0] + this.numberSlide.max;
    }
    if (!controlPoint.includes(this.activeElem)) {
      return true;
    }
    return false;
  }

  activeAnimateFrame(flag) {
    if (!flag) {
      window.cancelAnimationFrame(this.animates);
      return;
    }
    this.animates = this.animate();
  }

  animate() {
    if (this.amountSlideForChange >= 1) {
      this.changeNext();
      this.amountSlideForChange -= 1;
      this.pret = this.x;
    } else if (this.amountSlideForChange <= -1) {
      this.changePrev();
      this.amountSlideForChange += 1;
      this.pret = this.x;
    }
    this.animates = requestAnimationFrame(this.animate.bind(this));
  }
  // end block  change slide functions
}

export default SliderModel;

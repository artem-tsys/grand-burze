import ionRangeSlider from 'ion-rangeslider';
import $ from 'jquery';
import {
  size,
  has,
  set,
  includes,
  toNumber,
  forIn,
  cloneDeep,
} from 'lodash';
import EventEmitter from '../eventEmitter/EventEmitter';
import {
  addBlur, debounce,
} from '../general/General';

// for update filter params. set new nameParam in functions (getTypeFilterParam, getMinMaxParam )
class FilterModel extends EventEmitter {
  constructor(config) {
    super();
    this.types = {
      area: 'range',
      floor: 'range',
      rooms: 'checkbox',
      option: 'option',
    };
    this.configProject = {};
    // this.updateCurrentFilterFlatsId = config.updateCurrentFilterFlatsId;
    this.currentFilteredFlatIds$ = config.currentFilteredFlatIds$;
    this.currentFilteredFloorsData$ = config.currentFilteredFloorsData$;
    this.typeSelectedFlyby$ = config.typeSelectedFlyby$;
    this.flats = config.flats;
    this.uiMiniFilter = false;
    this.isListScrollBlocked = false;
  }

  // mappingSelectedTypePoly = {
  //   floor: () => {
  //     this.emit('filteredPolygonRemoveClass');
  //     const floors = this.currentFilteredFloorsData$.value;
  //     this.emit('showSelectedFloors', floors);
  //   },
  //   flat: () => {
  //     this.emit('filteredPolygonRemoveClass');
  //     const flats = this.currentFilteredFlatIds$.value;
  //     this.emit('showSelectedFlats', flats);
  //   },
  // };

  init() {
    this.configProject = this.createFilterParam(this.flats);
    this.reduceFilter = this.reduceFilter.bind(this);
    this.emit('setAmountAllFlat', size(this.flats));
    this.filterFlatStart();
    this.emit('updateHeightFilter');

    // this.typeSelectedFlyby$.subscribe(type => {
    //   console.log('this.typeSelectedFlyby$', type);
    //   const selectedTypePoly = this.mappingSelectedTypePoly[type];
    //   selectedTypePoly();
    // });
    this.deb = debounce(this.resize.bind(this), 500);
  }

  // запускает фильтр квартир
  filterFlatStart() {
    addBlur('.js-s3d-filter__table');
    addBlur('.js-s3d-pl__list');
    const filterSettings = this.getFilterParam(this.configProject);
    this.updateAllParamFilter(filterSettings);
    const { flats, floors } = this.startFilter(this.flats, filterSettings);
    this.emit('setAmountSelectFlat', flats.length);
    // this.updateCurrentFilterFlatsId(flats);
    this.currentFilteredFlatIds$.next(flats);
    this.currentFilteredFloorsData$.next(floors);

    // this.emit('filteredPolygonRemoveClass');
    // const type = this.typeSelectedFlyby$.value;
    // const selectedTypePoly = this.mappingSelectedTypePoly[type];
    // selectedTypePoly();
  }

  createFilterParam(flats) {
    let filterParams = {};
    for (const type in this.types) {
      const typeNames = this.types[type];
      let param = {};
      let rangeParam;
      switch (typeNames) {
          case 'range':
            rangeParam = this.createParam(flats, type, this.createRangeParam.bind(this));
            forIn(rangeParam, (setting, key) => {
              param[key] = {
                type: 'range',
                skin: 'round',
                elem: this.createRange(setting),
              };
            });
            break;
          case 'checkbox':
            param = this.createParam(flats, type, this.createCheckedParam);
            break;
          case 'option':
            param = this.createParam(flats, type, this.createOptionParam);
            break;
          default:
            param = {};
            break;
      }
      filterParams = {
        ...filterParams,
        ...param,
      };
    }
    return filterParams;
  }

  createParam(flats, keyFilter, callback) {
    const data = Object.keys(flats);
    const configProject = data.reduce((acc, key) => {
      const flat = flats[key];
      return { ...acc, ...callback(flat, keyFilter, acc) };
    }, {});
    return configProject;
  }

  // нужно переписать #change
  createRangeParam(flat, name, acc) {
    if (!has(flat, name)) {
      return acc;
    }
    const setting = acc;
    if (!setting[name]) {
      setting[name] = { min: flat[name], max: flat[name] };
      return setting;
    }
    if (flat[name] < setting[name].min) {
      setting[name].min = flat[name];
    }
    if (flat[name] > setting[name].max) {
      setting[name].max = flat[name];
    }
    setting[name].type = name;
    return setting;
  }

  createCheckedParam(flat, name, acc) {
    if (!has(flat, name)) {
      return acc;
    }
    const elements = document.querySelectorAll(`.js-s3d-filter__checkboxes [data-type = ${name}]`);
    const value = [];
    elements.forEach(element => {
      value.push(toNumber(element.dataset[name]));
    });
    const params = {
      type: 'checkbox',
      elem: elements,
      value,
    };
    return { [name]: params };
  }

  createOptionParam(flat, name) {
    const elements = document.querySelectorAll(`.js-s3d-filter__checkboxes [data-type= ${name}]`);
    const value = [];
    elements.forEach(element => {
      value.push(element.dataset[name]);
    });
    const params = {
      type: 'option',
      elem: elements,
      value,
    };
    return { [name]: params };
  }

  // создает range slider (ползунки), подписывает на события
  createRange(config) {
    if (config.type !== undefined) {
      const self = this;
      const { min, max } = config;
      const $min = $(`.js-filter-range [data-type=${config.type}][data-border="min"]`);
      const $max = $(`.js-filter-range [data-type=${config.type}][data-border="max"]`);
      const rangeSlider = $(`.js-filter-range [data-type=${config.type}]`);
      rangeSlider.ionRangeSlider({
        type: 'double',
        grid: false,
        min,
        max,
        from: min || 0,
        to: max || 0,
        step: config.step || 1,
        onStart: updateInputs,
        onChange: updateInputs,
        onFinish(e) {
          updateInputs(e);
          self.filterFlatStart({ min: e.from, max: e.to, ...{ type: config.type } });
        },
        onUpdate: updateInputs,
      });
      const instance = rangeSlider.data('ionRangeSlider');
      instance.update({
        min,
        max,
        from: min,
        to: max,
      });

      function updateInputs(data) {
        $min.prop('value', data.from);
        $max.prop('value', data.to);
      }

      $min.on('change', function () { changeInput.call(this, 'from'); });
      $max.on('change', function () { changeInput.call(this, 'to'); });

      function changeInput(key) {
        let val = $(this).prop('value');
        if (key === 'from') {
          if (val < min) val = min;
          else if (val > instance.result.to) val = instance.result.to;
        } else if (key === 'to') {
          if (val < instance.result.from) val = instance.result.from;
          else if (val > max) val = max;
        }

        instance.update(key === 'from' ? { from: val } : { to: val });
        $(this).prop('value', val);
        self.filterFlatStart({ min: instance.result.from, max: instance.result.to, ...{ type: config.type } });
      }
      return instance;
    }
    return null;
  }

  // сбросить значения фильтра
  resetFilter() {
    // this.emit('filteredPolygonRemoveClass');

    const mapping = {
      range: param => param.elem.update({ from: param.elem.result.min, to: param.elem.result.max }),
      checkbox: param => param.elem.forEach(el => { el.checked = el.checked ? false : ''; }),
      option: param => param.elem.forEach(el => { el.checked = el.checked ? false : ''; }),
    };
    const keysConfiguration = Object.keys(this.configProject);
    keysConfiguration.forEach(key => {
      const params = this.configProject[key];
      if (mapping[params.type]) {
        mapping[params.type](params);
      }
    });
    this.filterFlatStart();
    // const flatsKeys = Object.keys(this.flats);
    // this.updateCurrentFilterFlatsId(flatsKeys);
    // this.emit('setAmountSelectFlat', flatsKeys.length);
  }

  updateAllParamFilter(filterSettings) {
    for (const key in filterSettings) {
      const select = filterSettings[key];
      const typeFilterParam = this.getTypeFilterParam(key)
      let { value } = cloneDeep(select);
      switch (typeFilterParam) {
          case 'checkbox':
            if (Array.isArray(value) && value.length === 0) {
              this.configProject[key].value.forEach(i => value.push(i));
            }
            value = value.join(', ');
            this.emit('updateMiniInfo', {
              type: key, value, key: 'amount',
            });
            break;
          case 'range':
            this.emit('updateMiniInfo', {
              type: key, value: select.min, key: 'min',
            });
            this.emit('updateMiniInfo', {
              type: key, value: select.max, key: 'max',
            });
            break;
          default:
            break;
      }
    }
  }

  getTypeFilterParam(name) {
    for (const type in this.types) {
      if (type.includes(name)) return this.types[type];
    }
    return null;
  }

  // поиск квартир по параметрам фильтра
  startFilter(flatList, settings) {
    const flats = Object.values(flatList);
    const settingColl = Object.entries(settings);
    const tempSelectedData = {};
    const floorsSelected = [];

    const filteredFlatsIds = flats.reduce((acc, flat) => {
      const isActive = settingColl.every(([name, value]) => {
        const hasKey = has(flat, [name]);
        if (!hasKey) {
          throw new Error(`flat is not include key: "${name}"`);
        }
        switch (value.type) {
            case 'range':
              return this.checkRangeParam(flat, name, value);
            case 'checkbox':
              return this.checkСheckboxParam(flat, name, value);
            case 'option':
              return this.checkOptionParam(flat, name, value);
            default:
              break;
        }
        return false;
      });
      if (!isActive) return acc;

      const {
        build, section, floor,
      } = flat;
      if (!has(tempSelectedData, [build, section, floor])) {
        if (!tempSelectedData[build]) {
          tempSelectedData[build] = {};
        }
        if (!tempSelectedData[build][section]) {
          tempSelectedData[build][section] = {};
        }
        if (!tempSelectedData[build][section][floor]) {
          tempSelectedData[build][section][floor] = true;
        }
        // set(tempSelectedData, `${build}.${section}.${floor}`, true);
        floorsSelected.push({
          build, section, floor,
        });
      }

      return [...acc, flat.id];
    }, []);
    return { flats: filteredFlatsIds, floors: floorsSelected };
  }

  checkRangeParam(flat, key, value) {
    return (has(flat, key)
      && flat[key] >= value.min
      && flat[key] <= value.max);
  }

  checkСheckboxParam(flat, key, value) {
    return (includes(value.value, flat[key]) || size(value.value) === 0);
  }

  checkOptionParam(flat, key, value) {
    if (value.value.length === 0) return true;
    return value.value.some(name => flat[key][name]);
  }

  // добавить возможные варианты и/или границы (min, max) в список созданых фильтров
  getFilterParam(filter) {
    const settings = {};
    for (const key in filter) {
      const { type } = filter[key];
      switch (type) {
          case 'checkbox':
            settings[key] = {};
            settings[key]['value'] = [];
            filter[key].elem.forEach(el => {
              if (el.checked) {
                settings[key].value.push(toNumber(el.dataset[key]));
              }
            });
            break;
          case 'range':
            settings[key] = {};
            settings[key]['min'] = filter[key].elem.result.from;
            settings[key]['max'] = filter[key].elem.result.to;
            break;
          case 'option':
            settings[key] = {};
            settings[key]['value'] = [];
            filter[key].elem.forEach(el => {
              if (el.checked) {
                settings[key].value.push(el.dataset[key]);
              }
            });
            break;
          default:
            break;
      }
      settings[key].type = type;
    }
    return settings;
  }

  reduceFilter(isShow) {
    if (isShow === this.uiMiniFilter) return;
    this.uiMiniFilter = isShow ?? !this.uiMiniFilter;
    this.changeListScrollBlocked(true);
    this.emit('reduceFilter', this.uiMiniFilter);
  }

  changeListScrollBlocked(value) {
    this.isListScrollBlocked = value;
  }

  hideFilter() {
    this.emit('hideFilter');
  }

  resize() {
    this.hideFilter();
  }
}

export default FilterModel;

import { keys, toJS, observable, action, computed } from "mobx";

export default class AppStore {
  _center;
  _zoom;
  _extent;
  _data;
  _filters;

  constructor(data) {
    this._center = observable.box([48, 2]);
    this._zoom = observable.box(6);
    this._extent = observable.box([]);
    this._data = data;

    this._filters = observable.box([
      {
        label: "Gender",
        type: "options",
        options: [
          {
            label: "male",
            value: "m",
            active: true,
          },
          {
            label: "female",
            value: "f",
            active: true,
          },
          {
            label: "double",
            value: "d",
            active: true,
          },
        ],
        filterFn: (item, options) => {
          if (options.every((o) => o.active)) {
            return true;
          } else if (options.every((o) => !o.active)) {
            return false;
          } else {
            const itemGender = item.gender;
            const thisOption = options.find((o) => o.value === itemGender);

            if (thisOption) {
              return thisOption.active;
            } else {
              return false;
            }
          }
        },
      },
      {
        label: "Status",
        type: "options",
        options: [
          {
            label: "priory",
            value: "priory",
            active: true,
          },
          {
            label: "abbey",
            value: "abbey",
            active: true,
          },
          {
            label: "others",
            value: "others",
            active: true,
          },
        ],
        filterFn: (item, options) => {
          if (options.every((o) => o.active)) {
            return true;
          } else if (options.every((o) => !o.active)) {
            return false;
          } else {
            const itemStatus = item.status_or_type;

            if (itemStatus == "abbey") {
              return options.find((o) => o.value === "abbey").active;
            } else if (itemStatus == "priory") {
              return options.find((o) => o.value === "priory").active;
            } else {
              return options.find((o) => o.value === "others").active;
            }
          }
        },
      },
      {
        label: "Time",
        type: "time",
        filterFn: (item, options) => {
          return true;
        },
      },
    ]);
  }

  @computed
  get mapData(): { y_coordinates; x_coordinates }[] {
    const dataFilters = this.filters;
    return this._data
      .filter((i) => i.y_coordinates && i.x_coordinates)
      .filter((item) => {
        return dataFilters.every((filterGroup) =>
          filterGroup.filterFn(item, filterGroup.options)
        );
      });
  }

  @computed
  get center(): Array<Number> {
    return toJS(this._center);
  }

  @computed
  get filters() {
    return toJS(this._filters);
  }

  @computed
  get zoom(): Number {
    return this._zoom.get();
  }

  @computed
  get extent(): Array<number> {
    return toJS(this._extent);
  }

  @action
  toggleFilterOption(groupLabel, optionLabel) {
    console.log("toggling", groupLabel, optionLabel);
    const newFilters = toJS(this.filters);

    const filterGroupToToggle = newFilters.find(
      (filterGroup) => filterGroup.label === groupLabel
    );
    if (filterGroupToToggle && filterGroupToToggle.options) {
      const filterOptionToToggle = filterGroupToToggle.options.find(
        (groupOption) => groupOption.label === optionLabel
      );

      if (filterOptionToToggle) {
        filterOptionToToggle.active = !filterOptionToToggle.active;
      }
    }
    this._filters.set(newFilters);
  }

  @action
  mapMoved(
    newCenter: Array<Number>,
    newZoom: Number,
    newExtent: Array<Number>
  ): void {
    this._center.set(newCenter);
    this._zoom.set(newZoom);
    this._extent.set(newExtent);
  }
}

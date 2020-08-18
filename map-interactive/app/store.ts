import { keys, toJS, observable, action, computed } from "mobx";
import { globals } from "./index";

export default class AppStore {
  _center;
  _zoom;
  _extent;
  _data;
  _filters;
  _openWelcome;

  constructor(data) {
    this._center = observable.box([48, 2]);
    this._zoom = observable.box(7);
    this._extent = observable.box([]);
    this._openWelcome = observable.box(true);
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
            icon: {
              class: "gender-m",
              shape: "⏹",
            },
          },
          {
            label: "female",
            value: "f",
            active: true,
            icon: {
              class: "gender-f",
              shape: "⏹",
            },
          },
          {
            label: "double",
            value: "d",
            active: true,
            icon: {
              class: "gender-d",
              shape: "⏹",
            },
          },
        ],
        filterFn: (item, filterGroup) => {
          const options = filterGroup.options;
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
            icon: {
              class: "gender-n",
              shape: "▲",
            },
          },
          {
            label: "abbey",
            value: "abbey",
            active: true,
            icon: {
              class: "gender-n",
              shape: "⏺",
            },
          },
          {
            label: "not-found",
            value: "not-found",
            active: true,
            icon: {
              class: "gender-n",
              shape: "❓",
            },
          },
          {
            label: "others",
            value: "others",
            active: true,
            icon: {
              class: "gender-n",
              shape: "⏹",
            },
          },
        ],
        filterFn: (item, filterGroup) => {
          const options = filterGroup.options;
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
            } else if (itemStatus == "status not found") {
              return options.find((o) => o.value === "not-found").active;
            } else {
              return options.find((o) => o.value === "others").active;
            }
          }
        },
      },
      {
        label: "Time",
        type: "time",
        value: globals.dates,
        filterFn: (item, filterGroup) => {
          const from = filterGroup.value[0];
          const to = filterGroup.value[1];

          return (
            item["foundation_earliest"] &&
            item["dissolution_latest"] &&
            item["foundation_earliest"] <= to &&
            item["dissolution_latest"] >= from
          );
        },
      },
    ]);
  }

  @computed
  get openWelcome() {
    return toJS(this._openWelcome);
  }

  @computed
  get data() {
    return toJS(this._data);
  }

  @computed
  get activeData(): { y_coordinates; x_coordinates }[] {
    const dataFilters = this.filters;
    return (
      this._data
        //.filter((i) => i.y_coordinates && i.x_coordinates)
        .filter((item) => {
          return dataFilters.every((filterGroup) =>
            filterGroup.filterFn(item, filterGroup)
          );
        })
    );
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
  toggleWelcome() {
    console.log("toggle welcome");
    this._openWelcome.set(!this.openWelcome);
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
  changeTimeValue(newDateValue: number[]): void {
    const newFilters = toJS(this.filters);
    newFilters.find((fg) => fg.label === "Time").value = newDateValue;
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

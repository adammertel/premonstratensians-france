import * as React from "react";
import { observer } from "mobx-react";
import Slider, { Range } from "rc-slider";
import Tooltip from "rc-tooltip";
import { classnames } from "tailwindcss-classnames";

import { globals } from "./../index";

import "rc-slider/assets/index.css";

type LegendProps = {
  store;
};

const renderCheckbox = (checked, clickEvt, groupLabel, optionLabel, icon) => {
  return (
    <li
      key={optionLabel}
      className="md:items-center checkbox block table-row cursor-pointer"
      onClick={() => clickEvt(groupLabel, optionLabel)}
    >
      <i
        id={optionLabel}
        className={`icon mr-4 mt-2 table-cell ${
          checked ? "text-muni icon-check" : "text-black icon-square"
        }`}
      />
      <span
        id={optionLabel}
        className="text-sm align-text-top tb-2 font-normal"
      >
        {optionLabel}
      </span>
      <div className="marker-icon inline-flex text-lg align-center px-2 table-cell">
        <span className={`icon-utf ${icon.class}`}>
          {String.fromCharCode(icon.shape)}
        </span>
      </div>
    </li>
  );
};

export const Legend: React.FC<LegendProps> = observer(({ store }) => {
  const filters = store.filters;

  const [filterDates, setFilterDates] = React.useState(globals.dates);
  const [filterDateInputFrom, setFilterDateInputFrom] = React.useState(
    globals.dates[0]
  );
  const [filterDateInputTo, setFilterDateInputTo] = React.useState(
    globals.dates[1]
  );

  //
  const [
    filterDateInputFromValid,
    setFilterDateInputFromValid,
  ] = React.useState(true);
  const [filterDateInputToValid, setFilterDateInputToValid] = React.useState(
    true
  );

  const dateInputInvalidStyle = "p-2 w-20 bg-danger text-white";
  const dateInputValidStyle = "p-2 w-20 text-muni";
  return (
    <div className="legend">
      {filters.map((filter) => {
        return (
          <div
            className={`filter-group filter-group-${filter.label}`}
            key={filter.label}
          >
            <b>{filter.label}</b>

            <ul className="block">
              {filter.type === "options" &&
                filter.options.map((option) => {
                  return renderCheckbox(
                    option.active,
                    (groupLabel, optionLabel) => {
                      store.toggleFilterOption(groupLabel, optionLabel);
                    },
                    filter.label,
                    option.label,
                    option.icon
                  );
                })}
              {filter.type === "time" && (
                <div>
                  <label>
                    <input
                      type="number"
                      className={
                        filterDateInputFromValid
                          ? dateInputValidStyle
                          : dateInputInvalidStyle
                      }
                      value={filterDateInputFrom}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setFilterDateInputFrom(newValue);

                        if (
                          newValue <= globals.dates[1] &&
                          newValue >= globals.dates[0] &&
                          newValue < filterDates[1]
                        ) {
                          setFilterDateInputFromValid(true);
                          setFilterDates([newValue, filterDates[1]]);
                          store.changeTimeValue([newValue, filterDates[1]]);
                        } else {
                          setFilterDateInputFromValid(false);
                        }
                      }}
                    />
                    {"to"}
                    <input
                      type="number"
                      className={
                        "ml-8 " +
                        (filterDateInputToValid
                          ? dateInputValidStyle
                          : dateInputInvalidStyle)
                      }
                      value={filterDateInputTo}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setFilterDateInputTo(newValue);

                        if (
                          newValue <= globals.dates[1] &&
                          newValue >= globals.dates[0] &&
                          newValue > filterDates[0]
                        ) {
                          setFilterDateInputToValid(true);
                          setFilterDates([filterDates[0], newValue]);
                          store.changeTimeValue([filterDates[0], newValue]);
                        } else {
                          setFilterDateInputToValid(false);
                        }
                      }}
                    />
                  </label>
                  <>
                    <Range
                      min={globals.dates[0]}
                      max={globals.dates[1]}
                      value={filterDates}
                      onChange={(newDates) => {
                        setFilterDates(newDates);

                        setFilterDateInputFrom(newDates[0]);
                        setFilterDateInputTo(newDates[1]);
                        setFilterDateInputFromValid(true);
                        setFilterDateInputToValid(true);
                      }}
                      onAfterChange={store.changeTimeValue.bind(store)}
                      defaultValue={globals.dates}
                      allowCross={false}
                    />
                  </>
                </div>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
});

import * as React from "react";
import { observer } from "mobx-react";
import Slider, { Range } from "rc-slider";
import Tooltip from "rc-tooltip";

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
        <span className={`icon ${icon.class}`}>{icon.shape}</span>
      </div>
    </li>
  );
};

export const Legend: React.FC<LegendProps> = observer(({ store }) => {
  const filters = store.filters;

  const [filterDates, setFilterDates] = React.useState(globals.dates);
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
                  <label>{filterDates.join("–")}</label>
                  <>
                    <Range
                      min={globals.dates[0]}
                      max={globals.dates[1]}
                      value={filterDates}
                      onChange={setFilterDates}
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

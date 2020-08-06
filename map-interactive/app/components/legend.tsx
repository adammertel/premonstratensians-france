import * as React from "react";
import { observer } from "mobx-react";

type LegendProps = {
  store;
};

const renderCheckbox = (checked, clickEvt, groupLabel, optionLabel) => {
  return (
    <li
      key={optionLabel}
      className="md:items-center "
      onClick={() => clickEvt(groupLabel, optionLabel)}
    >
      <label className="block text-black font-bold">
        <span>
          {checked ? (
            <i
              id={optionLabel}
              className="icon icon-check mr-2 mt-2 text-muni"
            />
          ) : (
            <i
              id={optionLabel}
              className={"icon mr-2 mt-2 text-black icon-square"}
            />
          )}
        </span>
        <span
          id={optionLabel}
          className="text-sm align-text-top tb-2 font-normal"
        >
          {optionLabel}
        </span>
      </label>
    </li>
  );
};

export const Legend: React.FC<LegendProps> = observer(({ store }) => {
  const filters = store.filters;
  return (
    <div className="legend">
      {filters.map((filter) => {
        return (
          <div
            className={"filter-group filter-group-${filter.label}"}
            key={filter.label}
          >
            <b>{filter.label}</b>

            <ul>
              {filter.type === "options" &&
                filter.options.map((option) => {
                  return renderCheckbox(
                    option.active,
                    (groupLabel, optionLabel) => {
                      store.toggleFilterOption(groupLabel, optionLabel);
                    },
                    filter.label,
                    option.label
                  );
                })}
              {filter.type === "time" && <div>sliders</div>}
            </ul>
          </div>
        );
      })}
    </div>
  );
});

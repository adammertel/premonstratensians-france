import * as React from "react";

type LegendProps = {
  store;
};

const renderCheckbox = (checked, clickEvt, label) => {
  return (
    <li key={label} className="md:items-center ">
      <label className="block text-black font-bold">
        <span>
          {checked ? (
            <i
              id={label}
              onClick={clickEvt()}
              className="icon icon-check mr-2 mt-2 text-muni"
            />
          ) : (
            <i
              id={label}
              onClick={clickEvt()}
              className={"icon mr-2 mt-2 text-black icon-square"}
            />
          )}
        </span>
        <span
          id={label}
          onClick={clickEvt()}
          className="text-sm align-text-top tb-2 font-normal"
        >
          {label}
        </span>
      </label>
    </li>
  );
};

export const Legend: React.FC<LegendProps> = ({ store }) => {
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
                  return renderCheckbox(option.active, () => {}, option.label);
                })}
              {filter.type === "time" && <div>sliders</div>}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

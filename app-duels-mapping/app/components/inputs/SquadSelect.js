"use client";

import CustomSelect from "./CustomSelect";

/**
 * Squad filter for the drawer.
 *
 * Squads arrive as plain strings from the season's rows, so this maps them onto the
 * { value, label } shape CustomSelect takes and otherwise defers to it -- the two
 * dropdowns were near-identical, and multi-select is worth implementing once.
 */
export default function SquadSelect({ options = [], value = [], onChange }) {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      placeholder="All Squads"
      options={options.map((squad) => ({ value: squad, label: squad }))}
    />
  );
}

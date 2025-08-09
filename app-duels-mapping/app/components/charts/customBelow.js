import { Chart, Tooltip } from 'chart.js';

Chart.Tooltip.positioners.customBelow = function (elements, eventPosition) {
  const tooltipModel = Tooltip.positioners.average(elements, eventPosition);

  if (tooltipModel) {
    tooltipModel.y += 10; // ✅ move 10px below the point
  }

  return tooltipModel;
};

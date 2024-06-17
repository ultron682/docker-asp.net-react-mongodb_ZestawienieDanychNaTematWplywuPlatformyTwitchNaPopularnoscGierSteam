import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "./ChartDateSlider.module.css";

const ChartDateSlider = ({ max, firstDate, lastDate, range, onChange, maxRangeLimit }) => {
  return (
    <div className={styles.datePicker}>
      <div className={styles.dateLabel}>{firstDate}</div>
      <Slider
        range
        min={0}
        max={max}
        className={styles.dateSlider}
        value={range}
        pushable={1}
        draggableTrack
        onChange={(value) => {
          if (maxRangeLimit && value[1] - value[0] >= 1 && value[1] - value[0] <= maxRangeLimit) {
            onChange(value);
          } else if (!maxRangeLimit && value[1] - value[0] >= 1) {
            onChange(value);
          }
        }}
      />
      <div className={styles.dateLabel}>{lastDate}</div>
    </div>
  );
};

export default ChartDateSlider;

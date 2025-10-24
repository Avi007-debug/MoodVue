import { useState } from 'react';
import TimePeriodSelector from '../TimePeriodSelector';

export default function TimePeriodSelectorExample() {
  const [selected, setSelected] = useState<"day" | "week" | "month">("week");

  return (
    <div className="p-6">
      <TimePeriodSelector 
        selected={selected}
        onChange={(period) => {
          setSelected(period);
          console.log('Period changed to:', period);
        }}
      />
    </div>
  );
}

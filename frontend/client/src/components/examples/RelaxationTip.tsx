import { useState } from 'react';
import RelaxationTip from '../RelaxationTip';

export default function RelaxationTipExample() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Tip dismissed
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <RelaxationTip 
        tip="Take a moment to breathe deeply. Inhale for 4 counts, hold for 4, and exhale for 4. This simple exercise can help reduce stress and increase focus."
        onDismiss={() => setVisible(false)}
      />
    </div>
  );
}

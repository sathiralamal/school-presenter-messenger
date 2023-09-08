import { useEffect, useState, useRef } from "react";

export default function usePrevious(currentValue:any) {
    const ref = useRef();
    // Store current value in ref
    useEffect(() => {
      ref.current = currentValue;
    }, [currentValue]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)
    return ref.current;
}

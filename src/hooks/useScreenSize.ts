import { useEffect, useState } from "react";

const useScreenSize = () => {
    const [windowSize, setWindowSize] = useState({ height: 0, width: 0 });
    const [mobile, setMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });

            const width = window.innerWidth;

            if (width < 992) {
                setMobile(true);
            } else {
                setMobile(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return {
        mobile,
    };
};

export default useScreenSize;

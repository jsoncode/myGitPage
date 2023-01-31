import {useEffect, useState} from "react";

const useWidth = () => {
    const [width, setWidth] = useState(1200); // default width, detect on server.
    const handleResize = () => setWidth(window.innerWidth);
    useEffect(() => {
        setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
    return width;
};
export default useWidth

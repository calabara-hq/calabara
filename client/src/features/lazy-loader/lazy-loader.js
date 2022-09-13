import { useState, useEffect } from "react";
import Placeholder from "../creator-contests/components/common/spinner";

const LazyLoader = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(true);
        }, 250);
        return () => {
            clearTimeout(timeout);
        };
    }, [250]);

    return show ? <Placeholder /> : null;

}

export default LazyLoader
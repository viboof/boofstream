"use client";

import { useEffect, useState } from "react";

export default function Page() {
    const [_, setCsr] = useState(false);

    useEffect(() => {
        setCsr(true);
    }, []);

    window.location.pathname = "/commentator";

    return <><a href="/commentator">go here</a></>
}

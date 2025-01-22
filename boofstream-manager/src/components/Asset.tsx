"use client";

import { getBackendHost } from "@/utils";
import { CSSProperties } from "react";

export default function Asset(props: { 
    path: string, 
    heightPx?: number, 
    style?: CSSProperties
}) {
    return <img 
        src={`${getBackendHost()}assets/${props.path}`} 
        height={props.heightPx || 12} 
        style={props.style} 
    />;
}

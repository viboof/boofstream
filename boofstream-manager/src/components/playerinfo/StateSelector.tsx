import { getBackendHost } from "@/utils";
import { useEffect, useState } from "react";
import Asset from "./Asset";
import BoofSelect from "./forms/BoofSelect";

export function StateSelector(
    { value, country, onChange }:
    { value: string, country: string, onChange: (state: string) => void },
) {
    console.log("StateSelector render, value/country:", value, country);

    const [stateCodes, setStateCodes] = useState([] as string[]);

    useEffect(() => {
        if (!country) return;

        const cacheKey = "cachedStateCodes:" + country;

        const cachedCodes = sessionStorage.getItem(cacheKey);

        if (cachedCodes) {
            setStateCodes(JSON.parse(cachedCodes));
            return;
        }

        fetch(getBackendHost() + "countries/" + country.toUpperCase() + "/states")
            .then(res => res.json())
            .then(codes => {
                sessionStorage.setItem(cacheKey, JSON.stringify(codes));
                setStateCodes(codes);
            });
    }, []);

    function label(value: string) {
        return <><Asset path={`state_flag/${country.toUpperCase()}/${value}.png`} /> {value.toUpperCase()}</>
    }

    return <BoofSelect 
        value={value} 
        onChange={state => onChange(state || "")} 
        options={stateCodes.map(
            c => ({ value: c, label: label(c) })
        )}
    />
}

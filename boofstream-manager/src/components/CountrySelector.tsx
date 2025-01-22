import { getBackendHost } from "@/utils";
import { useEffect, useState } from "react";
import BoofSelect from "./BoofSelect";
import Asset from "./Asset";

export default function CountrySelector(
    { value, onChange }: 
    { value: string, onChange: (value: string) => void }
) {
    const [countryCodes, setCountryCodes] = useState([] as string[]);

    useEffect(() => {
        const cachedCodes = sessionStorage.getItem("cachedCountryCodes");

        if (cachedCodes) {
            setCountryCodes(JSON.parse(cachedCodes));
            return;
        }

        fetch(getBackendHost() + "countries")
            .then(res => res.json())
            .then(codes => {
                sessionStorage.setItem("cachedCountryCodes", JSON.stringify(codes));
                setCountryCodes(codes);
            });
    }, []);

    function label(value: string) {
        return <><Asset path={`country_flag/${value}.png`} /> {value.toUpperCase()}</>
    }

    return <BoofSelect 
        value={value} 
        onChange={country => onChange(country || "")} 
        options={countryCodes.map(
            c => ({ value: c, label: label(c) })
        )}
    />
}

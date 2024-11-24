"use client";

import Select from "react-select";

export type ValueObj<T> = {
    value?: T,
    label: JSX.Element,
};

const EMPTY_OPTION = { label: <div style={{ height: "24px" }}></div> };

export default function BoofSelect<T>(props: { 
    value?: T,
    options: ValueObj<T>[],
    onChange?: (value?: T) => void, 
}) {
    const valuesToLabels: Map<T, JSX.Element> = new Map();

    for (const option of props.options) {
        valuesToLabels.set(option.value!!, option.label);
    }

    function computeValueObj(value?: T): ValueObj<T> {
        if (value === undefined) {
            return EMPTY_OPTION;
        }

        return { value, label: valuesToLabels.get(value)!! };
    }

    const valueObj = computeValueObj(props.value);

    function onChange(newValueObj: ValueObj<T>) {
        if (props.onChange) props.onChange(newValueObj.value);
    }

    return <Select 
        value={valueObj} 
        options={[EMPTY_OPTION, ...props.options]} 
        onChange={e => onChange(e!!)} 
    />;
}

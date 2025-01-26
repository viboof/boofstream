export default function Score({ value, onChange }: { value: number, onChange: (value: number) => void }) {
    const style = { fontSize: 32, paddingLeft: 16, paddingRight: 16, paddingBottom: 4 };

    return <>
        <h1 style={{ fontSize: 72 }}>{value}</h1>
        <button style={style} onClick={() => onChange(value + 1)}>↑</button>{" "}
        <button style={style} onClick={() => onChange(value - 1)}>↓</button>
    </>
}

export default function BigInput(props: JSX.IntrinsicElements["input"]) {
    return <input {...props} style={{ fontSize: 24, ...props.style }} />
}
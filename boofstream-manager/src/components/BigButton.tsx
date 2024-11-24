export default function BigButton(props: JSX.IntrinsicElements["button"]) {
    return <button {...props} style={{ fontSize: 24, ...props.style }} />
}

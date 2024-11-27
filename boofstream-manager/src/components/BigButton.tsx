export default function BigButton(props: JSX.IntrinsicElements["button"] & { color?: string }) {
    return <button {...props} style={{ fontSize: 24, backgroundColor: props.color }} />
}

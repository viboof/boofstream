export default function OutsideLink({ href, children }: React.PropsWithChildren<{ href: string }>) {
    return <a href={href} style={{ color: "blue", textDecoration: "underline" }}>{children}</a>
}

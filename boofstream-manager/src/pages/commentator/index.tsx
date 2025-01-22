import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Commentator() {
    const router = useRouter();
    useEffect(() => { router.push("/").then(); });
    return <span />;
}

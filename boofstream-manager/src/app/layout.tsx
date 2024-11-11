import type { Metadata } from "next";
import "./globals.css";
import Boof from "../assets/boof.gif";
import Image from "next/image";

export const metadata: Metadata = {
	title: "boofstream",
	description: "what the boof",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Image src={Boof} alt="boof logo" /> <h1 style={{ display: "inline", fontSize: 64 }}>boofstream</h1>
				<hr style={{ margin: "10px" }} />
				{children}
			</body>
		</html>
	);
}

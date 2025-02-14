import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-footer mt-auto w-full border-t">
            <div className="mx-auto max-w-5xl py-4 px-6 flex items-center justify-between text-sm text-gray-500">
                <p>SABLE</p>
                <nav className="flex gap-4">
                    <Link href="/terms" className="hover:text-gray-700">
                        Terms
                    </Link>
                    <Link href="/privacy" className="hover:text-gray-700">
                        Privacy
                    </Link>
                </nav>
            </div>
        </footer>
    )
}
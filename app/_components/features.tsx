import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Features() {
    return (
        <section className="mx-auto max-w-3xl px-6 py-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Completely Open Source</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-400">
                        Retain full control of your data with a fully open-source platform.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Stay Organized</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-400">
                        Keep all chats and references together—no more scattered notes or confusion across multiple apps.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Bring Your Data  <span className="text-xs text-gray-500">(Coming Soon)</span></CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-400">
                        Consolidate data from S3, Google Drive, Notion, Dropbox, and more—all in a single hub for easy access.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>RAG as a Service <span className="text-xs text-gray-500">(Coming Soon)</span></CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-400">
                        Leverage Retrieval-Augmented Generation to query vast documents with minimal effort. Stay tuned for updates!
                    </p>
                </CardContent>
            </Card>

        </section>
    )
}
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 dark:bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">PropLead AI</h1>
          <p className="text-sm text-muted mt-1">AI-powered real estate lead engine</p>
        </div>
        {children}
      </div>
    </div>
  );
}

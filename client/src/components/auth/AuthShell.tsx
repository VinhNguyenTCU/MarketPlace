export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 6 }}>{title}</h1>
      {subtitle ? (
        <p style={{ marginTop: 0, opacity: 0.8 }}>{subtitle}</p>
      ) : null}
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}

export { metadata, viewport } from "next-sanity/studio";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ height: "100vh", margin: 0, overscrollBehavior: "none" }}>
      {children}
    </div>
  );
}

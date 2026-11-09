// Re-mounts on every dashboard navigation, so each page settles in with a short, interruptible
// fade-and-rise (.admin-enter in globals.css; off when reduced motion is set).
export default function PanelTemplate({ children }: { children: React.ReactNode }) {
  return <div className="admin-enter">{children}</div>;
}

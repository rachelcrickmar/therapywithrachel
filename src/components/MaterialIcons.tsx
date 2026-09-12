type IconProps = {
  className?: string;
  title?: string;
};

/** Material Symbols–style outlined icons (Google icon language) */
function IconShell({
  children,
  className = "",
  title,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function FavoriteIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35Z" />
    </IconShell>
  );
}

export function PsychologyIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M13 3c-3.87 0-7 3.13-7 7 0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7Zm2 11.68V16h-4v-1.32A5.004 5.004 0 0 1 8 10c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.91-1.07 3.57-2.64 4.42L15 14.68ZM9 21h6v2H9v-2Z" />
    </IconShell>
  );
}

export function SpaIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M15.49 9.63c-.18-2.79-1.31-5.51-3.43-7.63-2.14 2.14-3.32 4.86-3.55 7.63 1.28.68 2.46 1.56 3.49 2.63 1.03-1.06 2.21-1.94 3.49-2.63Zm-6.89 1.26c.11.05.22.12.32.18-.47.94-.78 1.98-.78 3.08 0 1.66.72 3.14 1.85 4.17l1.56-2.03c-.52-.54-.85-1.26-.85-2.07 0-.84.34-1.6.89-2.15-.74-.48-1.5-.87-2.3-1.18H8.6ZM12 15.45c.91 1.21 1.6 2.55 2.05 3.97.75-.61 1.37-1.37 1.8-2.24-.76-.38-1.47-.89-2.09-1.5L12 15.45Zm4.9-4.56c-.8.31-1.56.7-2.3 1.18.55.55.89 1.31.89 2.15 0 .81-.33 1.53-.85 2.07l1.56 2.03A5.98 5.98 0 0 0 18 14.15c0-1.1-.31-2.14-.78-3.08.1-.06.21-.13.32-.18h-.64Z" />
    </IconShell>
  );
}

export function DiversityIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm1.5 1h-3C1.12 14 0 15.12 0 16.5V17h5.5v-.5c0-.79.31-1.5.82-2.03A3.48 3.48 0 0 0 5.5 14ZM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm1.5 1h-3c-.4 0-.78.08-1.13.23.51.53.83 1.24.83 2.02V17H24v-.5c0-1.38-1.12-2.5-2.5-2.5ZM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3Zm0 8c2.33 0 7 1.17 7 3.5V19H5v-1.5C5 15.17 9.67 14 12 14Z" />
    </IconShell>
  );
}

export function SelfImprovementIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M12 2C9.79 2 8 3.79 8 6s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4Zm0 14.33c-1.48-.94-3.21-1.33-5-1.33-.69 0-1.37.07-2.03.2C4.36 16.13 4 17.17 4 18.27V21h16v-2.73c0-1.1-.36-2.14-1-3.01-.65-.15-1.33-.26-2.03-.26-1.79 0-3.52.39-5 1.33Z" />
    </IconShell>
  );
}

export function VolunteerIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2Zm4 18v-6h2.5l-2.54-7.63A2.01 2.01 0 0 0 18.06 7h-.12c-.8 0-1.54.5-1.85 1.26L14.55 13H13V7.5c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5V20h2v-6h1.61l2.12 6H20ZM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5ZM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2Zm1.5 2H4c-.83 0-1.5.67-1.5 1.5V22h3V14h1v8h3V9.5C9.5 8.67 8.83 8 8 8H7Z" />
    </IconShell>
  );
}

export function EcoIcon(props: IconProps) {
  return (
    <IconShell {...props}>
      <path d="M6.05 8.05c-2.73 2.73-2.73 7.17-.02 9.9 1.43 1.42 3.31 2.15 5.21 2.15 1.31 0 2.63-.35 3.81-1.05-1.4.34-2.92.18-4.26-.49-2.64-1.3-4.21-4.36-3.35-7.3.15-.52-.35-.97-.85-.85-1.2.3-2.27.97-3.07 1.84l2.53-3.2ZM12 3c-1.29 0-2.58.34-3.73 1.02 1.4-.35 2.91-.19 4.25.49 2.64 1.3 4.21 4.36 3.35 7.3-.15.52.35.97.85.85 1.2-.3 2.27-.97 3.07-1.84l-2.53 3.2c2.73-2.73 2.73-7.17.02-9.9C16.17 3.72 14.09 3 12 3Z" />
    </IconShell>
  );
}

const SERVICE_ICONS = [
  { match: /trauma|ptsd/i, Icon: FavoriteIcon },
  { match: /ocd|intrusive/i, Icon: PsychologyIcon },
  { match: /adhd|neuro/i, Icon: DiversityIcon },
  { match: /anxiet|women/i, Icon: SpaIcon },
];

export function iconForService(title: string) {
  const found = SERVICE_ICONS.find((item) => item.match.test(title));
  return found?.Icon || SelfImprovementIcon;
}

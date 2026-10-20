import type { SVGProps } from "react";

export type IconName =
  | "shield"
  | "sunrise"
  | "receipt"
  | "sprout"
  | "heart"
  | "book"
  | "chat"
  | "line"
  | "phone"
  | "mail"
  | "arrow"
  | "check"
  | "x"
  | "menu"
  | "sparkle"
  | "star"
  | "print"
  | "briefcase"
  | "pen"
  | "clock"
  | "globe"
  | "lock"
  | "refresh";

const paths: Record<IconName, React.ReactNode> = {
  shield: (
    <>
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
      <path d="M9.5 12l2 2 3.5-4" />
    </>
  ),
  sunrise: (
    <>
      <path d="M4 18h16M6 14a6 6 0 0112 0" />
      <path d="M12 4v3M5 8l1.5 1.5M19 8l-1.5 1.5" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-4 3-6 7-6 0 4-3 6-7 6zM12 13c0-3-2.5-5-6-5 0 3 2.5 5 6 5z" />
    </>
  ),
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" />,
  book: (
    <>
      <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z" />
      <path d="M4 19a2 2 0 012-2h13" />
    </>
  ),
  chat: (
    <>
      <path d="M4 6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3H10l-5 4v-4a3 3 0 01-1-3V6z" />
      <path d="M8 8h8M8 11.5h5" />
    </>
  ),
  line: (
    <>
      <path d="M12 3C6.5 3 2.5 6.6 2.5 11c0 3.9 3.4 7.1 7.9 7.8l-.3 2.8c-.1.6.5.9 1 .5l4.1-2.8C19 18.1 21.5 14.8 21.5 11c0-4.4-4-8-9.5-8z" />
      <path d="M7.5 9v4M10.5 9v4M13.5 9v4l2.5-4v4M16.5 9v4h2" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12l4 4L19 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />,
  print: (
    <>
      <path d="M7 8V3h10v5M7 17H4a1 1 0 01-1-1v-6a1 1 0 011-1h16a1 1 0 011 1v6a1 1 0 01-1 1h-3" />
      <rect x="7" y="14" width="10" height="7" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V4h6v3M3 12h18" />
    </>
  ),
  pen: <path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM13 6l3 3" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  refresh: <path d="M20 12a8 8 0 01-14 5.3M4 12a8 8 0 0114-5.3M18 3v4h-4M6 21v-4h4" />,
};

export function Icon({ name, className, ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

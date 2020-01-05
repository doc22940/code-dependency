import * as React from "react";

interface SideNavItemProps {
  id: string;
  name: string;
  onClick?: () => Promise<void>;
  items?: SideNavItemProps[];
  depth?: number;
  children?: React.ReactNode;
}

const SpanStyle: React.CSSProperties = {
  paddingLeft: 8,
  paddingRight: 8,
  lineHeight: 1.5,
  fontSize: 14,
  cursor: "pointer",
  width: "100%",
};

const ButtonStyle: React.CSSProperties = {
  position: "relative",
  paddingRight: 8,
  lineHeight: 1.5,
  textAlign: "left",
  display: "block",
  width: "100%",
  padding: "2px 0",
  color: "#000",
  margin: 0,
  outline: "none",
  borderRadius: 0,
  cursor: "pointer",
  backgroundColor: "rgba(0, 0, 0, 0)",
  borderStyle: "none",
  fontSize: 14,
};

const SideNav = (props: SideNavItemProps) => {
  const [isActive, toggleActive] = React.useState(false);
  if (!props.children) {
    return (
      <button
        type="button"
        key={props.id}
        id={props.id}
        style={{ ...ButtonStyle, paddingLeft: 6 * (props.depth || 0) }}
        onClick={() => {
          toggleActive(!isActive);
          props.onClick && props.onClick();
        }}
      >
        {props.name}
        {isActive && props.children}
      </button>
    );
  }
  return (
    <div key={props.id} id={props.id} style={{ paddingLeft: 6 * (props.depth || 0) }}>
      <span
        style={SpanStyle}
        onClick={() => {
          toggleActive(!isActive);
          props.onClick && props.onClick();
        }}
      >
        {props.name}
      </span>
      {isActive && props.children}
    </div>
  );
};

export { SideNav as Component, SideNavItemProps as Props };

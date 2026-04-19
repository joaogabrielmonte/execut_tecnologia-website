function Badge({ children, variant = "solid" }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export default Badge;
function Button({ children, href, variant = "primary", className = "", ...props }) {
  const classes = `btn btn-${variant} ${className}`.trim();

  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  );
}

export default Button;
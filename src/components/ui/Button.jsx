import { Link } from "react-router-dom";

function Button({ children, href, variant = "primary", className = "", ...props }) {
  const classes = `btn btn-${variant} ${className}`.trim();

  return (
    <Link to={href} className={classes} {...props}>
      {children}
    </Link>
  );
}

export default Button;
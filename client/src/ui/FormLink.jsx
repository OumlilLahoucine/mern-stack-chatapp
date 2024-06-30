import { Link } from "react-router-dom";

function FormLink({ text, link, to, center = true }) {
  return (
    <p
      className={`font-medium ${center ? "text-center" : "text-start sm:text-center"}`}
    >
      {text}&nbsp;
      <Link
        to={to}
        className="text-primary transition-colors hover:text-danger"
      >
        {link}
      </Link>
    </p>
  );
}

export default FormLink;

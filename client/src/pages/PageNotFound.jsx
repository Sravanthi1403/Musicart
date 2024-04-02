import { Link } from "react-router-dom";

export const PageNotFound = () => {
  return (
    <>
      <section
        id="error-page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "79vh",
          marginTop: "15vh",
        }}
      >
        <div className=" content">
          <h1 className="header">404</h1>
          <h1>Sorry! Page not found</h1>
          <h2>
            Oops! It seems like the page you&apos;re trying to access the page
            that doesn&apos;t exist. If you believe there&apos;s an issue, feel
            free to <Link to="/">report</Link> it, and we&apos;ll look into it.
          </h2>
        </div>
      </section>
    </>
  );
};

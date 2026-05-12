const LoginBackground = () => (
  <>
    <div
      aria-hidden
      className="pointer-events-none absolute w-full"
      style={{
        top: -149,
        height: 297,
        background: "#23CFD5",
        opacity: 0.4,
        filter: "blur(100px)",
        borderRadius: "50%",
      }}
    />
    <div
      aria-hidden
      className="pointer-events-none absolute w-full"
      style={{
        bottom: -75,
        height: 151,
        background: "#23CFD5",
        opacity: 0.4,
        filter: "blur(45.5px)",
        borderRadius: "50%",
      }}
    />
  </>
);

export default LoginBackground;

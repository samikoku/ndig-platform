export default function ContactBlock({ className = "" }: { className?: string }) {
  return (
    <address className={`not-italic text-sm leading-relaxed ${className}`}>
      <p className="font-semibold">Nigeria Diaspora Investment Gateway</p>
      <p>Suite C-3, Jahi Plaza</p>
      <p>6 John Eshiette Etteifa Crescent</p>
      <p>Jahi, Abuja, Nigeria</p>
      <p className="mt-2">
        Email:{" "}
        <a href="mailto:info@ndigateway.org" className="underline hover:no-underline">info@ndigateway.org</a>
        {" · "}
        <a href="mailto:diaspora@ndigateway.org" className="underline hover:no-underline">diaspora@ndigateway.org</a>
      </p>
      <p>
        Phone: <a href="tel:+2349134445680" className="underline hover:no-underline">+234 913 444 5680</a>
      </p>
    </address>
  );
}

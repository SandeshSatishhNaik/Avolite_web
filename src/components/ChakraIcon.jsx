/** The 24-spoke chakra mark used in the header and hero radar. */
export default function ChakraIcon(props) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <circle cx="32" cy="32" r="26" />
        <circle cx="32" cy="32" r="5" fill="currentColor" />
      </g>
      <g stroke="currentColor" strokeWidth="2">
        <line x1="32" y1="6" x2="32" y2="58" />
        <line x1="6" y1="32" x2="58" y2="32" />
        <line x1="13.6" y1="13.6" x2="50.4" y2="50.4" />
        <line x1="50.4" y1="13.6" x2="13.6" y2="50.4" />
      </g>
    </svg>
  );
}

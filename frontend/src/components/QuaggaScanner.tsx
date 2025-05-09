// import { useEffect, useRef } from "react";
// import Quagga from "quagga";

// export function QuaggaScanner({
//   onDetected,
// }: {
//   onDetected: (code: string) => void;
// }) {
//   const elRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     Quagga.init(
//       {
//         inputStream: {
//           type: "LiveStream",
//           constraints: { facingMode: "environment" },
//           area: { top: "25%", right: "10%", left: "10%", bottom: "25%" },
//           target: elRef.current,
//         },
//         decoder: {
//           readers: ["ean_reader"], // pour EAN‑13
//         },
//       },
//       (err) => {
//         if (err) return console.error(err);
//         Quagga.start();
//       }
//     );

//     Quagga.onDetected((result) => {
//       const code = result.codeResult.code;
//       if (code) {
//         onDetected(code);
//         Quagga.stop();
//       }
//     });

//     return () => {
//       Quagga.stop();
//     };
//   }, [onDetected]);

//   return <div ref={elRef} style={{ width: 300, height: 300 }} />;
// }

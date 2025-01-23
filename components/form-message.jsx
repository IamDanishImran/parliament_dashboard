export function FormMessage({ message }) {
  // Check if message is an object, else treat it as a single message string
  const isObject = message && typeof message === "object";
  
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {/* Success message */}
      {isObject && "success" in message && (
        <div className="text-foreground border-l-2 border-foreground px-4">
          {message.success}
        </div>
      )}

      {/* Error message */}
      {isObject && "error" in message && (
        <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-4">
          {message.error}
        </div>
      )}

      {/* General message */}
      {isObject && "message" in message && (
        <div className="text-foreground border-l-2 px-4">{message.message}</div>
      )}

      {/* If message is a string, display it directly */}
      {!isObject && message && (
        <div className="text-foreground border-l-2 px-4">{message}</div>
      )}
    </div>
  );
}



// export function FormMessage({ message }) {
//   return (
//     <div className="flex flex-col gap-2 w-full max-w-md text-sm">
//       {"success" in message && (
//         <div className="text-foreground border-l-2 border-foreground px-4">
//           {message.success}
//         </div>
//       )}
//       {"error" in message && (
//         <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-4">
//           {message.error}
//         </div>
//       )}
//       {"message" in message && (
//         <div className="text-foreground border-l-2 px-4">{message.message}</div>
//       )}
//     </div>
//   );
// }

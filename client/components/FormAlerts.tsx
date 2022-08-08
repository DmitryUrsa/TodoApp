import { Alert } from "react-daisyui"

type ResponceMessage = { status: string; message: string }

export default function FormAlerts({
  resultMessage,
}: {
  resultMessage: ResponceMessage | undefined
}) {
  if (!resultMessage) return null

  return (
    <div className="mt-4">
      {resultMessage.status == "error" && (
        <Alert status="warning">{resultMessage.message}</Alert>
      )}
      {resultMessage.status == "success" && (
        <Alert status="success">{resultMessage.message}</Alert>
      )}
    </div>
  )
}
